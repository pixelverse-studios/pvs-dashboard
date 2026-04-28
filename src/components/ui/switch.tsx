'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends Omit<React.ComponentProps<'button'>, 'onChange'> {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

function Switch({
    checked,
    onCheckedChange,
    className,
    disabled,
    ...props
}: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            data-state={checked ? 'checked' : 'unchecked'}
            className={cn(
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-muted transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary',
                className,
            )}
            onClick={() => onCheckedChange(!checked)}
            {...props}
        >
            <span
                className={cn(
                    'pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform',
                    checked ? 'translate-x-[1.2rem]' : 'translate-x-0.5',
                )}
            />
        </button>
    )
}

export { Switch }
