<script lang="ts">
	import Modal from '$lib/components/modalComponents/Modal.svelte';
	import Select from '$lib/components/formComponents/Select.svelte';

	let basicModalOpen = $state(false);
	let confirmModalOpen = $state(false);
	let formModalOpen = $state(false);
	let persistentModalOpen = $state(false);
	let fullscreenModalOpen = $state(false);
	let nestedModalOpen = $state(false);
	let nestedModal2Open = $state(false);
	let testModalOpen = $state(false); // For testing size + animation

	let selectedSize: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' = $state('md');
	let selectedAnimation: 'fade' | 'scale' | 'slide' | 'none' = $state('scale');

	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	function handleFormSubmit() {
		console.log('Form submitted:', formData);
		formModalOpen = false;
	}

	function handleDelete() {
		console.log('Item deleted');
		confirmModalOpen = false;
	}
</script>

<div class="min-h-screen p-8 space-y-8" style="background-color: var(--color-base-200);">
	<header class="border-b pb-6" style="border-color: var(--color-base-300);">
		<h1 class="text-3xl font-bold mb-2" style="color: var(--color-base-content);">Modal Component Demo</h1>
		<p class="opacity-70" style="color: var(--color-base-content);">
			Accessible, themeable modal dialogs with focus trapping and keyboard support.
		</p>
	</header>

	<!-- Basic Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold" style="color: var(--color-base-content);">Basic Modals</h2>
		
		<div class="flex flex-wrap gap-4">
			<button
				class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
				style="background-color: var(--color-primary); color: var(--color-primary-content);"
				onclick={() => (basicModalOpen = true)}
			>
				Open Basic Modal
			</button>

			<button
				class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
				style="background-color: var(--color-error); color: var(--color-error-content);"
				onclick={() => (confirmModalOpen = true)}
			>
				Open Confirm Dialog
			</button>

			<button
				class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
				style="background-color: var(--color-success); color: var(--color-success-content);"
				onclick={() => (formModalOpen = true)}
			>
				Open Form Modal
			</button>
		</div>
	</section>

	<!-- Size Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold" style="color: var(--color-base-content);">Modal Sizes</h2>
		
		<div class="flex items-center gap-4 mb-4">
			<Select
				label="Select Size"
				bind:value={selectedSize}
				options={[
					{ label: 'Small', value: 'sm' },
					{ label: 'Medium', value: 'md' },
					{ label: 'Large', value: 'lg' },
					{ label: 'Extra Large', value: 'xl' },
					{ label: 'Fullscreen', value: 'fullscreen' }
				]}
			/>
		</div>

		<button
			class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
			style="background-color: var(--color-secondary); color: var(--color-secondary-content);"
			onclick={() => (testModalOpen = true)}
		>
			Open {selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} Modal
		</button>
	</section>

	<!-- Animation Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold" style="color: var(--color-base-content);">Animations</h2>
		
		<div class="flex items-center gap-4 mb-4">
			<Select
				label="Select Animation"
				bind:value={selectedAnimation}
				options={[
					{ label: 'Fade', value: 'fade' },
					{ label: 'Scale', value: 'scale' },
					{ label: 'Slide', value: 'slide' },
					{ label: 'None', value: 'none' }
				]}
			/>
		</div>

		<button
			class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
			style="background-color: var(--color-accent); color: var(--color-accent-content);"
			onclick={() => (testModalOpen = true)}
		>
			Test {selectedAnimation.charAt(0).toUpperCase() + selectedAnimation.slice(1)} Animation
		</button>
	</section>

	<!-- Advanced Features -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold" style="color: var(--color-base-content);">Advanced Features</h2>
		
		<div class="flex flex-wrap gap-4">
			<button
				class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
				style="background-color: var(--color-warning); color: var(--color-warning-content);"
				onclick={() => (persistentModalOpen = true)}
			>
				Persistent Modal
			</button>

			<button
				class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
				style="background-color: var(--color-info); color: var(--color-info-content);"
				onclick={() => (nestedModalOpen = true)}
			>
				Nested Modals
			</button>
		</div>
	</section>

	<!-- Keyboard Instructions -->
	<section class="p-4 border rounded" style="background-color: var(--color-base-100); border-color: var(--color-base-300);">
		<h3 class="text-lg font-semibold mb-2" style="color: var(--color-base-content);">Keyboard Controls</h3>
		<ul class="space-y-1 opacity-80" style="color: var(--color-base-content);">
			<li><kbd class="px-2 py-1 rounded text-sm" style="background-color: var(--color-base-300);">ESC</kbd> - Close modal (except persistent)</li>
			<li><kbd class="px-2 py-1 rounded text-sm" style="background-color: var(--color-base-300);">Tab</kbd> - Next focusable element</li>
			<li><kbd class="px-2 py-1 rounded text-sm" style="background-color: var(--color-base-300);">Shift+Tab</kbd> - Previous focusable element</li>
		</ul>
	</section>
</div>

<!-- Basic Modal -->
<Modal
	bind:open={basicModalOpen}
	title="Basic Modal"
	size={selectedSize}
	animation={selectedAnimation}
	onclose={() => console.log('Basic modal closed')}
	onopen={() => console.log('Basic modal opened')}
>
	<div class="space-y-4">
		<p style="color: var(--color-base-content);">
			This is a basic modal dialog with a title and close button. You can close it by:
		</p>
		<ul class="list-disc list-inside opacity-80" style="color: var(--color-base-content);">
			<li>Clicking the X button</li>
			<li>Pressing ESC</li>
			<li>Clicking outside the modal</li>
			<li>Clicking the Close button below</li>
		</ul>
	</div>

	{#snippet footer()}
		<button
			class="px-4 py-2 rounded transition-colors hover:opacity-80"
			style="background-color: var(--color-base-200); color: var(--color-base-content);"
			onclick={() => (basicModalOpen = false)}
		>
			Close
		</button>
	{/snippet}
</Modal>

<!-- Confirm Delete Modal -->
<Modal
	bind:open={confirmModalOpen}
	title="Confirm Delete"
	size={selectedSize}
	animation={selectedAnimation}
	role="alertdialog"
>
	{#snippet header()}
		<h2 class="text-lg font-bold flex items-center gap-2" style="color: var(--color-error);">
			<span>⚠️</span>
			<span>Confirm Delete</span>
		</h2>
	{/snippet}

	<p style="color: var(--color-base-content);">
		Are you sure you want to delete this item? This action cannot be undone.
	</p>

	{#snippet footer()}
		<button
			class="px-4 py-2 rounded transition-colors hover:opacity-80"
			style="background-color: var(--color-base-200); color: var(--color-base-content);"
			onclick={() => (confirmModalOpen = false)}
		>
			Cancel
		</button>
		<button
			class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
			style="background-color: var(--color-error); color: var(--color-error-content);"
			onclick={handleDelete}
		>
			Delete
		</button>
	{/snippet}
</Modal>

<!-- Form Modal -->
<Modal bind:open={formModalOpen} title="Contact Form" size={selectedSize} animation={selectedAnimation}>
	<form class="space-y-4" onsubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
		<div>
			<label for="name" class="block text-sm font-medium mb-1" style="color: var(--color-base-content);">
				Name
			</label>
			<input
				id="name"
				type="text"
				bind:value={formData.name}
				class="w-full px-3 py-2 border rounded focus:outline-none"
				style="background-color: var(--color-base-100); color: var(--color-base-content); border-color: var(--color-base-300);"
				placeholder="Enter your name"
			/>
		</div>

		<div>
			<label for="email" class="block text-sm font-medium mb-1" style="color: var(--color-base-content);">
				Email
			</label>
			<input
				id="email"
				type="email"
				bind:value={formData.email}
				class="w-full px-3 py-2 border rounded focus:outline-none"
				style="background-color: var(--color-base-100); color: var(--color-base-content); border-color: var(--color-base-300);"
				placeholder="your@email.com"
			/>
		</div>

		<div>
			<label for="message" class="block text-sm font-medium mb-1" style="color: var(--color-base-content);">
				Message
			</label>
			<textarea
				id="message"
				bind:value={formData.message}
				rows="4"
				class="w-full px-3 py-2 border rounded focus:outline-none resize-none"
				style="background-color: var(--color-base-100); color: var(--color-base-content); border-color: var(--color-base-300);"
				placeholder="Enter your message"
			></textarea>
		</div>
	</form>

	{#snippet footer()}
		<button
			type="button"
			class="px-4 py-2 rounded transition-colors hover:opacity-80"
			style="background-color: var(--color-base-200); color: var(--color-base-content);"
			onclick={() => (formModalOpen = false)}
		>
			Cancel
		</button>
		<button
			type="button"
			class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
			style="background-color: var(--color-primary); color: var(--color-primary-content);"
			onclick={handleFormSubmit}
		>
			Submit
		</button>
	{/snippet}
</Modal>

<!-- Persistent Modal -->
<Modal bind:open={persistentModalOpen} title="Important Notice" size="md" persistent>
	<div class="space-y-4">
		<p style="color: var(--color-base-content);">
			This is a persistent modal. You cannot close it by:
		</p>
		<ul class="list-disc list-inside opacity-80" style="color: var(--color-base-content);">
			<li>Pressing ESC</li>
			<li>Clicking outside the modal</li>
		</ul>
		<p style="color: var(--color-base-content);">
			You must click the "I Understand" button below.
		</p>
	</div>

	{#snippet footer()}
		<button
			class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
			style="background-color: var(--color-primary); color: var(--color-primary-content);"
			onclick={() => (persistentModalOpen = false)}
		>
			I Understand
		</button>
	{/snippet}
</Modal>

<!-- Nested Modals -->
<Modal bind:open={nestedModalOpen} title="First Modal" zIndex={50}>
	<p class="mb-4" style="color: var(--color-base-content);">
		This is the first modal. Click the button below to open a second modal on top.
	</p>
	
	<button
		class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
		style="background-color: var(--color-secondary); color: var(--color-secondary-content);"
		onclick={() => (nestedModal2Open = true)}
	>
		Open Second Modal
	</button>

	{#snippet footer()}
		<button
			class="px-4 py-2 rounded transition-colors hover:opacity-80"
			style="background-color: var(--color-base-200); color: var(--color-base-content);"
			onclick={() => (nestedModalOpen = false)}
		>
			Close
		</button>
	{/snippet}
</Modal>

<Modal bind:open={nestedModal2Open} title="Second Modal (Nested)" zIndex={60} size="sm">
	<p style="color: var(--color-base-content);">
		This modal appears on top of the first one with a higher z-index.
	</p>

	{#snippet footer()}
		<button
			class="px-4 py-2 rounded hover:opacity-90 transition-opacity"
			style="background-color: var(--color-primary); color: var(--color-primary-content);"
			onclick={() => (nestedModal2Open = false)}
		>
			Close
		</button>
	{/snippet}
</Modal>

<!-- Test Modal (Size + Animation) -->
<Modal 
	bind:open={testModalOpen} 
	title={`${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} Modal - ${selectedAnimation.charAt(0).toUpperCase() + selectedAnimation.slice(1)} Animation`} 
	size={selectedSize}
	animation={selectedAnimation}
>
	<div class="space-y-4">
		<p style="color: var(--color-base-content);">
			This modal is using the <strong>{selectedSize}</strong> size with <strong>{selectedAnimation}</strong> animation.
		</p>
		<p style="color: var(--color-base-content);">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
		</p>
		{#if selectedSize === 'fullscreen'}
			<div class="p-4 rounded" style="background-color: var(--color-primary); color: var(--color-primary-content);">
				<p class="font-semibold">Fullscreen Mode</p>
				<p class="text-sm opacity-90">This modal takes up the entire viewport.</p>
			</div>
		{/if}
		<div class="p-3 rounded" style="background-color: var(--color-base-200);">
			<p class="text-sm" style="color: var(--color-base-content);">
				💡 Tip: Change the size or animation in the dropdowns above, close this modal, and reopen to see the changes!
			</p>
		</div>
	</div>

	{#snippet footer()}
		<button
			class="px-4 py-2 rounded transition-colors hover:opacity-80"
			style="background-color: var(--color-base-200); color: var(--color-base-content);"
			onclick={() => (testModalOpen = false)}
		>
			Close
		</button>
	{/snippet}
</Modal>

<style>
	kbd {
		font-family: monospace;
	}
</style>
