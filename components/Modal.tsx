"use client";
import { Progress } from "@nextui-org/react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { FunctionComponent, useState } from "react";
import { HiX } from "react-icons/hi";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";

import { RouteErrorResponse } from "@/typings";
import cn from "@/utils/cn";

import ErrorBanner from "./Error";

interface Props {
    className?: string;
    variant?: "default" | "danger";

    title: string;
    children: React.ReactNode;
    subChildren?: React.ReactNode;

    onSubmit?: () => Promise<Response> | undefined;
    onSuccess?: () => void;
    onClose: () => void;

    show: boolean;
    buttonName?: string
}
const Modal: FunctionComponent<Props> = ({ className, variant, title, children, subChildren, onSubmit, onClose, onSuccess, show, buttonName = "Submit" }) => {

    const [state, setState] = useState<"LOADING" | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    return (
        <MotionConfig
            transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
        >
            <AnimatePresence initial={false}>

                {show &&
                    <motion.div
                        initial="closed"
                        animate={show ? "open" : "closed"}
                        exit="closed"
                        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                        className="fixed top-0 left-0 h-screen w-full inset-0 bg-black/70 flex items-center justify-center z-50"
                        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
                    >
                        <motion.div
                            initial="closed"
                            animate={show ? "open" : "closed"}
                            exit="closed"
                            variants={{
                                closed: {
                                    y: "var(--y-closed, 0)",
                                    opacity: "var(--opacity-closed)",
                                    scale: "var(--scale-closed, 1)"
                                },
                                open: {
                                    y: "var(--y-open, 0)",
                                    opacity: "var(--opacity-open)",
                                    scale: "var(--scale-open, 1)"
                                }
                            }}
                            className="
                            md:relative fixed bottom-0 min-h-[333px] md:min-h-fit m-2
                            w-full md:w-[480px] bg-[var(--background-rgb)] rounded-xl shadow-md
                            max-sm:[--y-closed:16px] [--opacity-closed:0%] sm:[--scale-closed:90%]
                            max-sm:[--y-open:0px] [--opacity-open:100%] sm:[--scale-open:100%]
                        "
                        >

                            <div className="p-4 pb-0 mb-16 md:mb-0">

                                <div className="flex items-center">
                                    <span className="text-2xl font-semibold dark:text-neutral-200 text-neutral-800">{title}</span>
                                    <button
                                        onClick={() => onClose()}
                                        className="ml-auto dark:bg-neutral-800/50 bg-neutral-200/50 dark:hover:bg-neutral-700/50 hover:bg-neutral-300/50 dark:text-neutral-400 text-neutral-600 dark:hover:text-neutral-200 hover:text-neutral-800 duration-200 rounded-md p-1.5"
                                    >
                                        <HiX className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <Progress
                                    size="sm"
                                    isIndeterminate={state === "LOADING"}
                                    aria-label="Loading..."
                                    className="mt-2 mb-3 h-0.5"
                                    classNames={{
                                        track: "dark:bg-wamellow-light bg-wamellow-100-light",
                                        indicator: "bg-violet-500"
                                    }}
                                    value={0}
                                />

                                <div className={"scrollbar-none p-0.5 pb-4 sm:max-h-[512px] max-h-[384px] overflow-y-scroll " + className}> {/* sm:max-h-[512px] max-h-[384px] overflow-y-scroll */}
                                    {error && <ErrorBanner message={error} removeButton={true} />}

                                    {children}
                                </div>

                            </div>

                            <div className="md:relative absolute bottom-0 left-0 w-full dark:bg-wamellow/40 bg-wamellow-100/40 rounded-bl-md rounded-br-md">
                                <div className="flex items-center w-full gap-4 p-4">

                                    {state === "LOADING" ?
                                        <div className="flex items-center gap-2">
                                            <TailSpin stroke="#a3a3a3" strokeWidth={6} className="relative h-3 w-3 overflow-visible" />
                                            Submitting...
                                        </div>
                                        :
                                        subChildren
                                    }

                                    {onSubmit &&
                                        <button
                                            onClick={() => onClose()}
                                            className="ml-auto text-sm font-medium dark:text-neutral-200 text-neutral-800"
                                        >
                                            Cancel
                                        </button>
                                    }

                                    <button
                                        onClick={() => {
                                            if (state === "LOADING") return;
                                            if (!onSubmit) return onClose();

                                            setState("LOADING");
                                            onSubmit?.()
                                                ?.then(async (res) => {
                                                    setState(undefined);
                                                    if (res.ok) {
                                                        onClose();
                                                        onSuccess?.();
                                                    }
                                                    else setError((await res.json() as RouteErrorResponse).message || "Unknown server error");
                                                })
                                                .catch((e) => setError(e || "Unknown server error"));
                                        }}
                                        className={cn("flex bg-violet-600 hover:bg-violet-700 text-neutral-200 font-medium py-2 px-5 duration-200 rounded-md", !onSubmit && "ml-auto", state === "LOADING" && "opacity-50 cursor-wait", variant === "danger" && "bg-red-500/80 hover:bg-red-600")}
                                        disabled={state === "LOADING"}
                                    >
                                        <span>{buttonName}</span>
                                    </button>

                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                }

            </AnimatePresence>
        </MotionConfig>
    );

};

export default Modal;