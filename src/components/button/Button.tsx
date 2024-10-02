import classNames from "classnames";
import { useMemo } from "react";
import { Button as _Button, ButtonProps } from "react-bootstrap";

export default function Button({ className, ...rest }: ButtonProps) {
  const classnames = useMemo(
    () => classNames(["border-0", className]),
    [className]
  );

  return (
    <_Button
      variant="primary"
      {...rest}
      draggable={false}
      //size="sm"
      className={classnames}
      //href={project.url}
      target="_blank"
    />
  );
}
