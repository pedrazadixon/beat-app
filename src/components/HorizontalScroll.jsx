import { useRef, useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const scrollArrowSx = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  bgcolor: (t) =>
    t.palette.mode === "dark"
      ? "rgba(26, 26, 46, 0.85)"
      : "rgba(255, 255, 255, 0.9)",
  color: (t) =>
    t.palette.mode === "dark" ? "#f1f5f9" : "#1e293b",
  backdropFilter: "blur(20px)",
  border: "1px solid",
  borderColor: (t) =>
    t.palette.mode === "dark"
      ? "rgba(148, 163, 184, 0.08)"
      : "rgba(0, 0, 0, 0.06)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  opacity: 0,
  transition: "opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    bgcolor: (t) =>
      t.palette.mode === "dark"
        ? "rgba(26, 26, 46, 0.95)"
        : "rgba(255, 255, 255, 1)",
  },
};

export default function HorizontalScroll({ title, children, sx: outerSx = {} }) {
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
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        mb: 3,
        position: "relative",
        "&:hover .scroll-arrow": { opacity: 1 },
        ...outerSx,
      }}
    >
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, px: 0.5 }}>
          {title}
        </Typography>
      )}

      <Box sx={{ position: "relative" }}>
        {canScrollLeft && (
          <IconButton
            className="scroll-arrow"
            onClick={() => scroll("left")}
            size="small"
            sx={{ ...scrollArrowSx, left: -12 }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {children}
        </Box>

        {canScrollRight && (
          <IconButton
            className="scroll-arrow"
            onClick={() => scroll("right")}
            size="small"
            sx={{ ...scrollArrowSx, right: -12 }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
