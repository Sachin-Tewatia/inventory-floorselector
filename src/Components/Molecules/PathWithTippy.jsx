import React, { useId } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import tippy from "tippy.js";
import ReactDOMServer from "react-dom/server";

function PathWithTippy({ HoverContent, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    return;
    if (!ref.current) return;

    if (ref.current._tippy) ref.current._tippy.destroy();

    tippy(ref.current, {
      content: ReactDOMServer.renderToStaticMarkup(HoverContent),
      allowHTML: true,
      animation: "shift-toward",
      placement: "right",
      arrow: false,
    });

    return () => {
      if (!ref.current) return;
      ref.current._tippy.destroy();
    };
  }, [props]);

  return <path {...props} ref={ref} />;
}

export default PathWithTippy;
