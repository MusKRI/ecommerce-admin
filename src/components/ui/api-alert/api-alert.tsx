"use client";

import { Copy, Server, Check } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";

import { Alert, AlertDescription, AlertTitle } from "../alert/alert";
import { Badge, BadgeProps } from "../badge/badge";
import { Button } from "../button/button";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const IconVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.3,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (description: string) => {
    setCopied(true);
    navigator.clipboard.writeText(description);
    setTimeout(() => setCopied(false), 2000);
  };

  const MotionCheck = motion(Check);
  const MotionCopy = motion(Copy);

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>

      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleCopy(description)}
        >
          <AnimatePresence>
            {copied ? (
              <MotionCheck
                variants={IconVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-4 h-4"
                key="COPY"
              />
            ) : (
              <MotionCopy
                variants={IconVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-4 h-4"
                key="COPY"
              />
            )}
          </AnimatePresence>
        </Button>
      </AlertDescription>
    </Alert>
  );
};
