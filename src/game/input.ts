export type Input = {
  left: boolean;
  right: boolean;
};

export function createInput(): Input {
  return { left: false, right: false };
}

//  Associa gli eventi tastiera all'oggetto Input
export function bindKeyboard(input: Input) {

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") input.left = true;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") input.right = true;
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") input.left = false;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") input.right = false;
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}
