<script>
    import { Button, Dropdown, DropdownItem, Helper } from "flowbite-svelte";
    import { ChevronDownSolid } from "flowbite-svelte-icons";

    export let models = [];
    export let selectedModel;

    let dropdownOpen = false;

    function handleModelChange(index) {
        selectedModel = models[index];
        console.log(selectedModel);
    }
</script>

<Button class="absolute top-0 left-0 mt-4 ml-4" color="primary"
    >Model {selectedModel.name}<ChevronDownSolid
        class="w-3 h-3 ml-2 text-white dark:text-white"
    /></Button
>
<Dropdown bind:open={dropdownOpen} class="w-60 p-3 space-y-1">
    {#each models as model, index}
        <DropdownItem
            on:click={() => {
                handleModelChange(index);
                dropdownOpen = false;
            }}>{model.name}</DropdownItem
        >
        <Helper class="pl-6">{model.description}</Helper>
        <Helper class="pl-6">{model.dimensions} dimensions</Helper>
    {/each}
</Dropdown>
