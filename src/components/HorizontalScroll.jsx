import { useRef, useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export default function HorizontalScroll({ title, children, sx = {} }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      const observer = new ResizeObserver(checkScroll);
      observer.observe(el);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        observer.disconnect();
      };
    }
  }, [children]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <Box className="horizontal-scroll-container" sx={{ mb: 3, ...sx }}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, px: 0.5 }}>
          {title}
        </Typography>
      )}

      <Box sx={{ position: "relative" }}>
        {canScrollLeft && (
          <IconButton
            className="scroll-arrow scroll-arrow-left"
            onClick={() => scroll("left")}
            size="small"
            sx={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
        )}

        <Box ref={scrollRef} className="horizontal-scroll-inner">
          {children}
        </Box>

        {canScrollRight && (
          <IconButton
            className="scroll-arrow scroll-arrow-right"
            onClick={() => scroll("right")}
            size="small"
            sx={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
