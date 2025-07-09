import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { Fragment, ReactNode } from 'react';

interface DropdownProps {
  align?: 'left' | 'right';
  width?: '48' | '96';
  contentClasses?: string;
  children: ReactNode;
}

interface DropdownTriggerProps {
  children: ReactNode;
}

interface DropdownContentProps {
  align?: 'left' | 'right';
  width?: '48' | '96';
  contentClasses?: string;
  children: ReactNode;
}

interface DropdownLinkProps {
  href: string;
  method?: string;
  as?: string;
  children: ReactNode;
}

function DropdownTrigger({ children }: DropdownTriggerProps) {
  return <MenuButton as={Fragment}>{children}</MenuButton>;
}

function DropdownContent({
  align = 'right',
  width = '48',
  contentClasses = 'py-1 bg-white dark:bg-gray-700',
  children,
}: DropdownContentProps) {
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
  );
}

function DropdownLink({
  href,
  method = 'get',
  as = 'a',
  children,
}: DropdownLinkProps) {
  return (
    <MenuItem>
      {({ focus }) => (
        <Link
          href={href}
          method={method as 'get' | 'post' | 'put' | 'patch' | 'delete'}
          as={as as 'a' | 'button'}
          className={`block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 ${
            focus ? 'bg-gray-100 dark:bg-gray-800' : ''
          }`}
        >
          {children}
        </Link>
      )}
    </MenuItem>
  );
}

export default function Dropdown({ children }: DropdownProps) {
  return (
    <Menu as="div" className="relative">
      {children}
    </Menu>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Link = DropdownLink;
