import { Listbox } from '@headlessui/react';
import React, { Fragment } from 'react';
import { ChevronDown } from 'styled-icons/fluentui-system-regular';

const SelectTimeFrameLabel: React.FC<{
  value: {
    label: string;
    unit: 'day' | 'month' | 'week' | 'hour';
  };
  onChange: any;
  className?: string;
  list: {
    label: string;
    unit: 'day' | 'month' | 'week' | 'hour';
  }[];
}> = ({ value, onChange, list, className }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <Listbox.Button className="px-2 py-1 border-black border-[1px]  flex flex-col rounded-lg">
          <span className="text-xs text-left 2xl:text-sm">Mode</span>
          <div className="inline-flex items-center 2xl:text-base text-sm">
            {value.label}
            <ChevronDown size="20" className="ml-4" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 shadow-lg rounded-md p-1 z-10 bg-white">
          {list.map((data, index) => (
            <Listbox.Option key={index} as={Fragment} value={data}>
              {({ selected }) => (
                <div
                  className={`px-4 py-1 rounded-lg transition-colors hover:bg-gray-500 hover:text-white hover:cursor-pointer 2xl:text-base text-sm
                            ${selected && 'bg-gray-500 text-white'}`}
                >
                  {data.label}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default SelectTimeFrameLabel;
