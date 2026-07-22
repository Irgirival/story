'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, value, onValueChange, defaultValue, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || value || '');
    
    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <SelectContext.Provider value={{ value: internalValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn(className)} {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);
Select.displayName = 'Select';

const SelectContext = React.createContext<{ value: string; onValueChange: (value: string) => void } | null>(null);

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    const value = children || context?.value || '';
    
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
          className
        )}
        {...props}
      >
        {value}
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('inline-flex items-center', className)} {...props}>
      {children}
    </span>
  )
);
SelectValue.displayName = 'SelectValue';

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { position?: 'popper' | 'inline'; sideOffset?: number }>(
  ({ className, children, position = 'popper', sideOffset = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      {...props}
    >
      <div className="max-h-[300px] overflow-y-auto">{children}</div>
    </div>
  )
);
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement> & { value: string; disabled?: boolean }>(
  ({ className, children, value, disabled, ...props }, ref) => (
    <li
      ref={ref}
      className={cn('relative py-1.5 pl-8 pr-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground', className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-current" />
      </span>
      {children}
    </li>
  )
);
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };