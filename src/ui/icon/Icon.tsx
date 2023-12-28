import React from "react";

type Props = {
  currency: string | undefined;
  className: React.SVGProps<SVGSVGElement>["className"];
};

export const Icon = ({ currency, className }: Props) => {
  if (!currency) {
    return null;
  }

  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={className}>
      <use
        xlinkHref={"/market-icons.svg#" + currency}
        href={"/market-icons.svg#" + currency}
      ></use>
    </svg>
  );
};
