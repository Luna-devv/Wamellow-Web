
import { Button } from "@nextui-org/react";
import React, { useState } from "react";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2,
    Ratelimited = 3
}

export default function Fetch({
    url,
    payload,
    icon,
    label,
    method,
    size,
    className
}: {
    url: `/${string}`;
    payload?: Record<string, unknown>;
    icon: React.ReactNode;
    label: string;
    method: "PUT" | "POST" | "DELETE";
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const handle = async () => {
        setState(State.Loading);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}${url}`, {
            method: method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload || {})
        });

        if (res.status === 429) {
            setState(State.Ratelimited);
            setTimeout(() => setState(State.Idle), 6 * 1000);
        }

        if (res.ok) {
            setState(State.Success);
            setTimeout(() => setState(State.Idle), 6 * 1000);
            return;
        }

        setState(State.Idle);

        if (res.headers.get("Content-Type")?.includes("application/json")) {
            const data = await res.json();
            setError(data.message);
            return;
        }

        setError(res.status + ": " + res.statusText);
    };

    return (
        <div
            className={className}
        >
            <Button
                className="w-full"
                onClick={handle}
                color={
                    state === State.Success
                        ? "success"
                        : "secondary"
                }
                startContent={state !== State.Loading && icon}
                variant="flat"
                isLoading={state === State.Loading}
                isDisabled={state === State.Ratelimited || state === State.Success}
                size={size || "md"}
            >
                {label}
            </Button>

            {error &&
                <div className="text-red-500 text-sm mt-1">
                    {error}
                </div>
            }
        </div>
    );
}