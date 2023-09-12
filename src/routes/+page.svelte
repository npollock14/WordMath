<script>
  import { onMount } from "svelte";
  import { resizeInputOnDynamicContent, getOperands, models } from "./utils";
  import ModelSelect from "$lib/components/ModelSelect.svelte";
  import TopResult from "../lib/components/TopResult.svelte";

  let expression = "king-man+woman";
  let results = [];
  let placeholderText = expression;
  let lastEvaluatedTime = 0;
  let selectedModel = models[0];
  let isLoading = true;
  let showResults = false;
  let isError = false;

  async function getResults(expression) {
    // Ensure the provided expression is URL-encoded
    const encodedExpression = encodeURIComponent(expression);

    const response = await fetch(
      `/api/embeddingsearch?query=${encodedExpression}&model=${selectedModel.name}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let result = await response.json();
    if (result.body) {
      return result.body;
    }
    return result;
  }

  function isNormalResults() {
    console.log(results.length);
    return results.length > 1;
  }

  onMount(() => {
    const input = document.querySelector("input");
    resizeInputOnDynamicContent(input);
    // also evaluate the expression on mount
    evaluateWrapper(expression);
  });

  async function evaluateExpression(expression) {
    console.log(
      "Evaluating expression: ",
      expression,
      "with model: ",
      selectedModel
    );

    let response = await getResults(expression);

    let nearest_words = response["nearest_words"];
    let distances = response["distances"];

    let operands = getOperands(expression);
    let filteredResults = [];
    for (let i = 0; i < nearest_words.length; i++) {
      let distance = distances[i];
      let word = nearest_words[i];
      if (operands.includes(word)) {
        continue;
      }
      filteredResults.push({
        word: word,
        distance: distance,
      });
    }
    results = filteredResults;
    console.log(results);
  }

  async function evaluateWrapper(expression) {
    if (
      expression.trim().length > 0 &&
      expression.trim().length < 100 &&
      Date.now() - lastEvaluatedTime > 1000
    ) {
      lastEvaluatedTime = Date.now();
      isError = false;
      isLoading = true;
      try {
        await evaluateExpression(expression);
        isLoading = false;
      } catch (e) {
        console.log(e);
        isLoading = false;
        isError = true;
      }
    } else {
      isError = true;
    }
  }

  function handleExpressionInput(event) {
    expression = event.target.value;
    console.log(expression);
    evaluateWrapper(expression);
  }
</script>

<main
  class="min-h-screen flex flex-col items-center justify-center bg-gray-900"
>
  <ModelSelect bind:selectedModel {models} />
  <div class="flex items-center text-6xl md:text-8xl leading-none space-x-4">
    <input
      class="text-white bg-transparent text-right text-6xl md:text-8xl leading-none rounded-md p-2 font-bold"
      style="box-sizing: border-box; min-width: 100px; outline: 3px solid lightgray;"
      placeholder={placeholderText}
      use:resizeInputOnDynamicContent
      bind:value={expression}
      on:focusout={() => (placeholderText = "king-man+woman")}
      on:focus={() => (placeholderText = "")}
      on:keydown={(e) => e.keyCode === 13 && handleExpressionInput(e)}
    />

    <span class="text-white mx-4">=</span>
  </div>
  <TopResult bind:results bind:isLoading bind:isError />

  {#if isNormalResults()}
    {#if !showResults}
      <button
        class="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200 focus:outline-none"
        on:click={() => (showResults = !showResults)}
      >
        Additional Results
      </button>
    {:else}
      <button
        class="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200 focus:outline-none"
        on:click={() => (showResults = !showResults)}
      >
        Hide Results
      </button>
    {/if}

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
