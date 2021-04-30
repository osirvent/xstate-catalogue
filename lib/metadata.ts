import * as Icons from './Icons';

export interface MetadataItem {
  title: string;
  icon: keyof typeof Icons;
  version: string;
}

export const metadata: Record<string, MetadataItem> = {
  "holding": {
    title: "holding",
    icon: "AllInclusiveOutlined",
    version: "0.1.0",
  },
};
