import { Divider } from "@nextui-org/react";

export function Section({
    title,
    children,
    ...props
}: {
    title: string;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <>
            <Divider className="mt-10 mb-4" />

            <div {...props}>
                <h3 className="text-xl text-neutral-200">{title}</h3>
                <p className="dark:text-neutral-500 text-neutral-400 mb-3">{children}</p>
            </div>
        </>
    );
}

export function SubSection({
    title,
    description,
    children,
    ...props
}: {
    title: string;
    description: string;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props}>
            <h3 className="text-medium font-medium text-neutral-300 mt-4">{title}</h3>
            <div className="dark:text-neutral-500 text-neutral-400 mb-3">
                <div className="mb-3">
                    {description}
                </div>
                {children}
            </div>
        </div>
    );
}