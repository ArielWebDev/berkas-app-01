import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

interface DropdownProps {
  align?: 'left' | 'right';
  width?: '48' | '96';
  contentClasses?: string;
  trigger: ReactNode;
  children: ReactNode;
}

export default function Dropdown({
  align = 'right',
  width = '48',
  contentClasses = 'py-1 bg-white',
  trigger,
  children,
}: DropdownProps) {
  let alignmentClasses = 'origin-top';

  if (align === 'left') {
    alignmentClasses = 'origin-top-left left-0';
  } else if (align === 'right') {
    alignmentClasses = 'origin-top-right right-0';
  }

  let widthClasses = '';
  if (width === '48') {
    widthClasses = 'w-48';
  } else if (width === '96') {
    widthClasses = 'w-96';
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton as="div">{trigger}</MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses} ${contentClasses}`}
        >
          {children}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

Dropdown.Link = function DropdownLink({
  href,
  method = 'get',
  as = 'a',
  className = '',
  children,
  ...props
}: any) {
  return (
    <MenuItem>
      {({ focus }) => (
        <a
          href={href}
          className={`block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out ${
            focus ? 'bg-gray-100' : ''
          } ${className}`}
          {...props}
        >
          {children}
        </a>
      )}
    </MenuItem>
  );
};
