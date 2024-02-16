import {memo, useLayoutEffect, useRef} from "react";

import {useTimelineContext} from "dnd-timeline";

interface TimeCursorProps {
  position: Date
  interval?: number;
}

function TimeCursor(props: TimeCursorProps) {
  const timeCursorRef = useRef<HTMLDivElement>(null);

  const { timeframe, timelineDirection, sidebarWidth, millisecondsToPixels } =
    useTimelineContext();

  const side = timelineDirection === "rtl" ? "right" : "left";

  useLayoutEffect(() => {
    const offsetCursor = () => {
      if (!timeCursorRef.current) return;
      const timeDelta = props.position.getTime() - timeframe.start.getTime();
      const timeDeltaInPixels = millisecondsToPixels(timeDelta);

      const sideDelta = sidebarWidth + timeDeltaInPixels;
      timeCursorRef.current.style[side] = `${sideDelta}px`;
    };

    offsetCursor();

    const interval = setInterval(offsetCursor, props.interval || 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    side,
    sidebarWidth,
    props.interval,
    timeframe.start,
    millisecondsToPixels,
  ]);

  return (
    <div
      ref={timeCursorRef}
      style={{
        height: "100%",
        width: "1px",
        zIndex: 3,
        backgroundColor: "red",
        position: "absolute",
      }}
    />
  );
}

export default memo(TimeCursor);