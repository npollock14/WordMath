<script>
  import { parse } from "postcss";
  import { get } from "svelte/store";

  let expression = "";
  let results = [];
  let placeholderText = "king-man+woman";
  let evaluating = false;
  let lastEvaluatedTime = 0;

  function getOperands(expression) {
    // gets the operands ex extracts king and man from "king + man"
    // split on + or - and trim extra whitespace
    let operands = expression.split(/[-+]/).map((operand) => operand.trim());
    // remove empty strings
    operands = operands.filter((operand) => operand.length > 0);
    return operands;
  }

  async function evaluateExpression(expression) {
    console.log("Evaluating expression");
    if (evaluating) {
      return;
    }
    console.log(expression.trim().length);
    if (expression.trim().length > 100) {
      return;
    }
    console.log("Here");

    let now = Date.now();
    console.log(now - lastEvaluatedTime);
    if (now - lastEvaluatedTime < 1000) {
      return;
    }
    evaluating = true;
    lastEvaluatedTime = now;

    results = ["..."];
    console.log("Evaluating expression: ", expression);
    console.log("Sending request to backend!");
    let response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "", //frontend API key
      },
      body: JSON.stringify({ query: expression }),
    });
    response = await response.json();
    let nearest_words = response["nearest_words"];
    if (!nearest_words) {
      results = ["No results found"];
      return;
    }
    let operands = getOperands(expression);
    console.log("Operands:" + operands);
    console.log("Nearest words: " + nearest_words);
    results = nearest_words.filter((word) => !operands.includes(word));
    console.log(results);
  }

  function handleInput(event) {
    expression = event.target.value;
    console.log(expression);
    if (expression.trim().length > 0) {
      evaluateExpression(expression);
    } else {
      results = ["..."];
    }
  }
  let showResults = false;

  function resizeInputOnDynamicContent(node) {
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
</script>

<main
  class="min-h-screen flex flex-col items-center justify-center bg-gray-900"
>
  <div class="flex items-center text-6xl md:text-8xl leading-none space-x-4">
    <input
      class="text-white bg-transparent text-right text-6xl md:text-8xl leading-none rounded-md p-2 font-bold"
      style="box-sizing: border-box; min-width: 100px; outline: 3px solid lightgray;"
      placeholder={placeholderText}
      use:resizeInputOnDynamicContent
      bind:value={expression}
      on:focusout={() => (placeholderText = "king-man+woman")}
      on:focus={() => (placeholderText = "")}
      on:keydown={(e) => e.keyCode === 13 && handleInput(e)}
    />

    <span class="text-white mx-4">=</span>
  </div>
  <div class="text-6xl md:text-8xl leading-none text-white">
    {results[0]}
  </div>
  {#if results.length > 1}
    <button
      class="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200 focus:outline-none"
      on:click={() => (showResults = !showResults)}
    >
      Additional Results
    </button>
    {#if showResults}
      <div
        class="mt-4 text-lg md:text-xl text-white overflow-hidden bg-gray-800 rounded-md shadow p-4"
      >
        <ul>
          {#each results.slice(1) as result, index (index)}
            <li class="border-b border-gray-700 last:border-b-0 py-1 pl-2">
              {result}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}
</main>

<style>
  input {
    caret-color: rgb(255, 255, 255); /* or any other color you want */
  }
</style>
