<script>
    import { SyncLoader } from "svelte-loading-spinners";
    import Tooltip from "./Tooltip.svelte";
    export let results = [];
    export let isLoading = false;
    export let isError = false;

    const resultItemFormat = {
        word: "",
        distance: 0,
    };

    const error = {
        message: "Error - check expression",
    };
</script>

{#if isLoading}
    <SyncLoader size="60" color="#374151" unit="px" duration="1s" />
{:else if isError}
    <div class="text-6xl md:text-8xl leading-none text-white">
        {error.message}
    </div>
{:else}
    <div
        class="text-6xl md:text-8xl leading-none text-white inline-block flex flex-row"
    >
        {results[0].word}
        <Tooltip
            title="This number represents the similarity between the result word and the expression. High similarity will result in a number close to 1."
        >
            <span class="distance text-gray-400">
                ({results[0].distance.toFixed(2)})
            </span>
        </Tooltip>
    </div>
{/if}

<style>
    .distance {
        font-size: 1.5rem;
        margin-left: 1rem;
        vertical-align: middle;
    }
</style>
