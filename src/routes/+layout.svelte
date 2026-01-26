<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime.js';
	import { ToastProvider } from '$lib/components/toastComponent/index.js';
	import './app.css';

	const { children } = $props();
</script>

<ToastProvider />
{@render children()}
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
