import { MDXProvider } from '@mdx-js/react';
import { inspect } from '@xstate/inspect';
import { useInterpret } from '@xstate/react';
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { StateMachine } from 'xstate';
import { useLayout } from '../../lib/GlobalState';
import { Widget } from '../../lib/Widgets'
import {
  Action,
  Context,
  Event,
  Guard,
  MachineHelpersContext,
  MDXMetadata,
  Service,
  State,
  WholeContext,
  Symbol
} from '../../lib/MachineHelpers';
import { metadata, MetadataItem } from '../../lib/metadata';

const useGetImports = (slug: string, deps: any[]) => {
  const [imports, setImports] = useState<{
    machine: StateMachine<any, any, any>;
    mdxDoc: any;
    mdxMetadata?: MDXMetadata;
  }>();

  const getMachine = async () => {
    setImports(undefined);
    const machineImport: {
      default: StateMachine<any, any, any>;
    } = await import(`../../lib/machines/${slug}.machine.ts`);

    const mdxDoc = await import(`../../lib/machines/${slug}.mdx`);

    setImports({
      machine: machineImport.default,
      mdxDoc: mdxDoc.default,
      mdxMetadata: mdxDoc.metadata,
    });
  };

  useEffect(() => {
    getMachine();
  }, [slug, ...deps]);

  return imports;
};

export const getStaticProps = async ({ params }) => {
  const fs = await import('fs');
  const path = await import('path');

  const machinesPath = path.resolve(
    process.cwd(),
    'lib/machines',
    `${params.id}.machine.ts`,
  );

  const meta = metadata[params.id];

  if (!meta) {
    throw new Error(
      `Could not find metadata for ${params.id}. Go to lib/metadata.ts to fix.`,
    );
  }

  return {
    props: {
      slug: params.id as string,
      fileText: fs.readFileSync(machinesPath).toString(),
      meta,
    },
  };
};

const MachinePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props,
) => {
  const layout = useLayout();
  const imports = useGetImports(props.slug, [layout]);

  const iframeRef = useRef(null);
  useEffect(() => {
    const { disconnect } = inspect({
      iframe: () => iframeRef.current,
    });

    return () => {
      disconnect();
    };
  }, [layout, props.slug]);

  return (
    <>
      <Head>
        <title>{props.meta.title} | XState Catalogue</title>
      </Head>
      <Layout
        content={
          <>
            {imports && (
              <ShowMachinePage
                slug={props.slug}
                machine={imports.machine}
                mdxDoc={imports.mdxDoc}
                fileText={props.fileText}
                meta={props.meta}
                mdxMetadata={imports.mdxMetadata}
              ></ShowMachinePage>
            )}
          </>
        }
        iframe={
          <iframe key="iframe" ref={iframeRef} className="w-full h-full" />
        }
      ></Layout>
    </>
  );
};

const Layout = (props: {
  content: React.ReactNode;
  iframe: React.ReactNode;
}) => {
  const layout = useLayout();
  if (layout === 'horizontal' || layout === 'vertical') {
    return (
      <div
        className={`md:grid h-full ${
          layout === 'horizontal' ? 'md:grid-cols-2' : 'md:grid-rows-2'
        }`}
      >
        <div className="hidden bg-black md:block">{props.iframe}</div>
        <div className="overflow-y-scroll md:pt-12">
          <div>{props.content}</div>
        </div>
      </div>
    );
  }
  if (layout === 'blog') {
    return (
      <div className="h-full overflow-y-scroll">
        <div>
          <div
            style={{ height: '500px' }}
            className="hidden bg-black md:block"
          >
            {props.iframe}
          </div>
          <div>{props.content}</div>
        </div>
      </div>
    );
  }

  return null;
};

const ShowMachinePage = (props: {
  machine: StateMachine<any, any, any>;
  mdxDoc: any;
  fileText: string;
  slug: string;
  meta: MetadataItem;
  mdxMetadata?: MDXMetadata;
}) => {
  const service = useInterpret(props.machine, {
    devTools: true,
  });
  
  return (
    <MachineHelpersContext.Provider
      value={{ service, metadata: props.mdxMetadata }}
    >
      <div className="flex justify-center">
        <div className="">
          <div
            style={{ height: '100px' }}
            className="flex justify-center p-6 mt-6 bg-gray-200 border-2 border-gray-600 rounded-3xl"
          >
            <Widget /> 
          </div>
          <div className="flex">
            <SideBar machine={props.machine} />
            <div className="p-6 space-y-6">
              <div className="prose lg:prose-lg">
                <MDXProvider
                  components={{
                    Event,
                    State,
                    Action,
                    Service,
                    Context,
                    WholeContext,
                    Symbol
                  }}
                >
                  <props.mdxDoc></props.mdxDoc>
                </MDXProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MachineHelpersContext.Provider>
  );
};

const machinePathRegex = /\.machine\.ts$/;

export const getStaticPaths: GetStaticPaths = async () => {
  const fs = await import('fs');
  const path = await import('path');

  const machinesPath = path.resolve(process.cwd(), 'lib/machines');

  const machines = fs.readdirSync(machinesPath);

  return {
    fallback: false,
    paths: machines
      .filter((machine) => machine.endsWith('.ts'))
      .map((fileName) => {
        return {
          params: {
            id: fileName.replace(machinePathRegex, ''),
          },
        };
      }),
  };
};

export default MachinePage;

const SideBar = (props: { machine: StateMachine<any, any, any> }) => {
  return (
    <div
      className="hidden p-6 space-y-16 border-r md:block"
      style={{ maxWidth: '300px' }}
    >
      <div className="w-48" />
      <Link href="/#Catalogue">
        <a className="space-x-3 text-base text-gray-600">
          <span className="text-gray-500">{'❮'}</span>
          <span>Back to List</span>
        </a>
      </Link>
      <div className="space-y-3">
        <h2 className="text-base font-semibold tracking-tighter text-gray-500">
          States
        </h2>
        <ul className="space-y-3">
          {props.machine.stateIds.map((id) => {
            if (id === props.machine.id) return null;
            return (
              <li key={`MACHINE ID: ${id}`}>
                <State>
                  {props.machine.getStateNodeById(id).path.join('.')}
                </State>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="space-y-3">
        <h2 className="text-base font-semibold tracking-tighter text-gray-500">
          Events
        </h2>
        <ul className="space-y-3">
          {props.machine.events
            .filter((event) => !event.startsWith('xstate.') && event)
            .map((event) => {
              return (
                <li key={`EVENT TYPE: ${event}`}>
                  <Event>{event}</Event>
                </li>
              );
            })}
        </ul>
      </div>
      {Object.keys(props.machine.options.actions).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tighter text-gray-500">
            Actions
          </h2>
          <ul className="space-y-3">
            {Object.keys(props.machine.options.actions).map((action) => {
              return (
                <li key={`ACTION: ${action}`}>
                  <Action>{action}</Action>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {Object.keys(props.machine.options.guards).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tighter text-gray-500">
            Guards
          </h2>
          <ul className="space-y-3">
            {Object.keys(props.machine.options.guards).map((guard) => {
              return (
                <li key={`GUARD: ${guard}`}>
                  <Guard>{guard}</Guard>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {Object.keys(props.machine.options.services).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tighter text-gray-500">
            Services
          </h2>
          <ul className="space-y-3">
            {Object.keys(props.machine.options.services).map((service) => {
              return (
                <li key={`SERVICE: ${service}`}>
                  <Service>{service}</Service>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
