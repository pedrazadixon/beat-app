import { useEffect, useState } from "react";

export default function PageContent({ children }) {
  const [mainStyle, setMainStyle] = useState({});

  useEffect(() => {
    const pageHeader = document.getElementById("page-header");
    const playerContainer =
      document.getElementsByClassName("player-container")[0];

    const headerResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const height = entry.contentRect.height;
      const paddingTop = parseInt(
        entry.target.style.paddingTop.replace("px", "")
      );
      const paddingBottom = parseInt(
        entry.target.style.paddingBottom.replace("px", "")
      );
      const totalHeight = height + paddingTop + paddingBottom;
      setMainStyle({
        height: `calc(100vh - ${playerContainer.offsetHeight}px - ${totalHeight}px)`,
        overflow: "auto",
      });
    });

    if (pageHeader) {
      headerResizeObserver.observe(pageHeader);
    } else {
      setMainStyle({
        height: `calc(100vh - ${playerContainer.offsetHeight}px)`,
        overflow: "auto",
      });
    }

    return () => {
      headerResizeObserver.disconnect();
    };
  }, []);

  return <main style={mainStyle}>{children}</main>;
}
