import type * as React from "react";

/*
Copied from https://github.com/gregberge/react-merge-refs/blob/main/src/index.tsx
I was struggling with Jest issues trying to transpile this file so created a local
copy.
 */

export function mergeRefs<T = any>(
    refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
    return (value) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        });
    };
}
