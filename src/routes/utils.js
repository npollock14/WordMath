export function resizeInputOnDynamicContent(node) {
  const measuringElement = document.createElement("div");
  document.body.appendChild(measuringElement);

  function duplicateAndSet() {
    const styles = window.getComputedStyle(node);
    measuringElement.innerHTML = node.value || node.placeholder;
    measuringElement.style.fontSize = styles.fontSize;
    measuringElement.style.fontFamily = styles.fontFamily;
    measuringElement.style.paddingLeft = styles.paddingLeft;
    measuringElement.style.paddingRight = styles.paddingRight;
    measuringElement.style.fontWeight = styles.fontWeight;
    measuringElement.style.minWidth = styles.minWidth;
    measuringElement.style.maxWidth = styles.maxWidth;
    measuringElement.style.boxSizing = "border-box";
    measuringElement.style.border = styles.border;
    measuringElement.style.width = "max-content";
    measuringElement.style.position = "absolute";
    measuringElement.style.top = "0";
    measuringElement.style.left = "-9999px";
    measuringElement.style.overflow = "hidden";
    measuringElement.style.visibility = "hidden";
    measuringElement.style.whiteSpace = "pre";
    measuringElement.style.height = "0";
    //   if width > 100% of parent width, set width to 90% of screen width
    if (measuringElement.offsetWidth > screen.width * 0.9) {
      measuringElement.style.width = `${node.parentNode.offsetWidth}px`;
    } else {
      node.style.width = `${measuringElement.offsetWidth}px`;
    }
  }

  duplicateAndSet();
  const observer = new MutationObserver(duplicateAndSet);
  observer.observe(node, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  node.addEventListener("input", duplicateAndSet);
  return {
    destroy() {
      observer.disconnect(node);
      node.removeEventListener("input", duplicateAndSet);
    },
  };
}

export function getOperands(expression) {
  // gets the operands ex extracts king and man from "king + man"
  // split on + or - and trim extra whitespace
  let operands = expression.split(/[-+]/).map((operand) => operand.trim());
  // remove empty strings
  operands = operands.filter((operand) => operand.length > 0);
  return operands;
}

export const models = [{
  name: "ada-002",
  description: "OpenAI's Ada Embedding Model",
  dimensions: 1536,
},
{
  name: "word2vec-google-news-300",
  description: "Pre-trained vectors trained on a part of the Google News dataset",
  dimensions: 300,
},
]