import { GitHub, ImportContactsOutlined, Twitter } from './Icons';
import css from './FrontPageHero.module.css';

export const FrontPageHero = () => {
  return (
    <div
      className={`px-6 py-12 bg-gray-800 md:py-20 xl:py-36 ${css.backgroundImage}`}
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          <div className="space-y-6 lg:col-span-4">
          </div>
          <div className="flex items-center col-span-2">
            <div className="w-full max-w-xs space-y-3">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
