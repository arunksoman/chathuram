<script lang="ts">
	import Tree from '$lib/components/treeComponents/Tree.svelte';
	import type {
		TreeNodeItem,
		TreeNodeEvent,
		TreeRenameEvent,
		TreeCreateEvent,
		TreeDropEvent
	} from '$lib/components/treeComponents/types.js';

	let treeComponent: Tree;

	// Initial tree data - note that folders must have children property (even if empty array)
	let treeData: TreeNodeItem[] = $state([
		{
			id: '1',
			name: 'src',
			expanded: true,
			editable: true,
			children: [
				{
					id: '2',
					name: 'components',
					editable: true,
					children: [
						{ id: '3', name: 'Button.svelte', editable: true },
						{ id: '4', name: 'Input.svelte', editable: true },
						{ id: '5', name: 'Modal.svelte', editable: true }
					]
				},
				{
					id: '6',
					name: 'routes',
					editable: true,
					children: [
						{ id: '7', name: '+page.svelte', editable: true },
						{ id: '8', name: '+layout.svelte', editable: true },
						{
							id: '9',
							name: 'blog',
							editable: true,
							children: [
								{ id: '10', name: '[slug]', editable: true, children: [
									{ id: '11', name: '+page.svelte', editable: true }
								]},
								{ id: '12', name: '+page.svelte', editable: true }
							]
						}
					]
				},
				{
					id: '13',
					name: 'lib',
					editable: true,
					children: [
						{ id: '14', name: 'utils.ts', editable: true },
						{ id: '15', name: 'api.ts', editable: true },
						{ id: '16', name: 'stores.ts', editable: true }
					]
				}
			]
		},
		{
			id: '17',
			name: 'public',
			editable: true,
			children: [
				{ id: '18', name: 'favicon.ico', editable: true },
				{ id: '19', name: 'robots.txt', editable: true },
				{ id: '20', name: 'logo.svg', editable: true }
			]
		},
		{
			id: '21',
			name: 'tests',
			editable: true,
			children: []
		},
		{
			id: '22',
			name: 'package.json',
			editable: true
		},
		{
			id: '23',
			name: 'README.md',
			editable: true
		},
		{
			id: '24',
			name: 'vite.config.ts',
			editable: true
		}
	]);

	let selectedInfo = $state('');
	let eventLog: string[] = $state([]);
	let multiSelect = $state(false);
	let draggable = $state(true);
	let keyboardNav = $state(true);

	function logEvent(message: string) {
		const timestamp = new Date().toLocaleTimeString();
		eventLog = [`[${timestamp}] ${message}`, ...eventLog.slice(0, 19)];
	}

	function handleSelect(event: TreeNodeEvent) {
		const node = event.node;
		const hasChildren = node.children && node.children.length > 0;
		const type = node.children !== undefined ? 'folder' : 'file';
		selectedInfo = `${node.name} (${type}, ID: ${node.id})`;
		logEvent(`✓ Selected: ${node.name}`);
	}

	function handleExpand(event: TreeNodeEvent) {
		const node = event.node;
		logEvent(`📂 Expanded: ${node.name}`);
	}

	function handleCollapse(event: TreeNodeEvent) {
		const node = event.node;
		logEvent(`📁 Collapsed: ${node.name}`);
	}

	function handleRename(event: TreeRenameEvent) {
		logEvent(`✏️ Renamed "${event.oldName}" → "${event.name}"`);
	}

	function handleCreate(event: TreeCreateEvent) {
		const location = event.parentId ? `in parent ${event.parentId}` : 'at root';
		logEvent(`➕ Created: ${event.node.name} (${location})`);
	}

	function handleDelete(event: TreeNodeEvent) {
		const node = event.node;
		logEvent(`🗑️ Deleted: ${node.name}`);
	}

	function handleDrop(event: TreeDropEvent) {
		logEvent(`🔄 Moved node ${event.sourceId} → ${event.targetId}`);
	}

	function handleNodesChange(newNodes: TreeNodeItem[]) {
		treeData = newNodes;
	}

	function addNewNode() {
		const selected = treeComponent?.getSelectedNodes();
		if (selected && selected.length > 0) {
			const parent = selected[0];
			// Check if parent is a folder (has children property)
			if (parent.children !== undefined) {
				const newNode: TreeNodeItem = {
					id: `node-${Date.now()}`,
					name: 'New Item',
					editable: true
				};
				treeComponent.createNode(parent.id, newNode);
			} else {
				logEvent('⚠️ Cannot add child to a file. Select a folder instead.');
			}
		} else {
			const newNode: TreeNodeItem = {
				id: `node-${Date.now()}`,
				name: 'New Folder',
				editable: true,
				children: []
			};
			treeComponent.createNode(null, newNode);
			logEvent('➕ Added new root folder');
		}
	}

	function addNewFolder() {
		const selected = treeComponent?.getSelectedNodes();
		if (selected && selected.length > 0) {
			const parent = selected[0];
			if (parent.children !== undefined) {
				const newNode: TreeNodeItem = {
					id: `folder-${Date.now()}`,
					name: 'New Folder',
					editable: true,
					children: []
				};
				treeComponent.createNode(parent.id, newNode);
			} else {
				logEvent('⚠️ Cannot add child to a file. Select a folder instead.');
			}
		} else {
			const newNode: TreeNodeItem = {
				id: `folder-${Date.now()}`,
				name: 'New Folder',
				editable: true,
				children: []
			};
			treeComponent.createNode(null, newNode);
		}
	}

	function deleteSelected() {
		const selected = treeComponent?.getSelectedNodes();
		if (selected && selected.length > 0) {
			selected.forEach((node) => {
				treeComponent.deleteNode(node.id);
			});
		} else {
			logEvent('⚠️ No nodes selected');
		}
	}

	function renameSelected() {
		const selected = treeComponent?.getSelectedNodes();
		if (selected && selected.length === 1) {
			treeComponent.startEditing(selected[0].id);
		} else if (selected && selected.length > 1) {
			logEvent('⚠️ Can only rename one node at a time');
		} else {
			logEvent('⚠️ No node selected');
		}
	}

	function expandAllNodes() {
		treeComponent?.expandAll();
		logEvent('📂 Expanded all nodes');
	}

	function collapseAllNodes() {
		treeComponent?.collapseAll();
		logEvent('📁 Collapsed all nodes');
	}

	let contextMenu = $state({
		visible: false,
		x: 0,
		y: 0,
		nodeId: ''
	});

	function handleContextMenu(event: MouseEvent, nodeId: string) {
		event.preventDefault();
		contextMenu = {
			visible: true,
			x: event.clientX,
			y: event.clientY,
			nodeId
		};
		
		const closeMenu = () => {
			contextMenu.visible = false;
			document.removeEventListener('click', closeMenu);
		};
		setTimeout(() => document.addEventListener('click', closeMenu), 0);
	}

	function handleContextAction(action: string) {
		const nodeId = contextMenu.nodeId;
		if (!nodeId) return;

		const node = treeComponent?.getSelectedNodes().find(n => n.id === nodeId) || 
		             findNodeById(treeData, nodeId);

		switch (action) {
			case 'rename':
				treeComponent.startEditing(nodeId);
				break;
			case 'delete':
				treeComponent.deleteNode(nodeId);
				break;
			case 'add-child':
				if (node && node.children !== undefined) {
					treeComponent.createNode(nodeId, {
						id: `node-${Date.now()}`,
						name: 'New Child',
						editable: true
					});
				} else {
					logEvent('⚠️ Cannot add child to a file');
				}
				break;
			case 'add-folder':
				if (node && node.children !== undefined) {
					treeComponent.createNode(nodeId, {
						id: `folder-${Date.now()}`,
						name: 'New Folder',
						editable: true,
						children: []
					});
				} else {
					logEvent('⚠️ Cannot add folder to a file');
				}
				break;
		}
		contextMenu.visible = false;
	}

	function findNodeById(nodes: TreeNodeItem[], id: string): TreeNodeItem | null {
		for (const node of nodes) {
			if (node.id === id) return node;
			if (node.children) {
				const found = findNodeById(node.children, id);
				if (found) return found;
			}
		}
		return null;
	}

	function clearSelections() {
		treeComponent?.clearSelection();
		selectedInfo = '';
		logEvent('🔄 Cleared all selections');
	}

	function clearLog() {
		eventLog = [];
	}
</script>

<div class="demo-container">
	<h1>Tree Component Demo</h1>

	<div class="controls-section">
		<h2>🎮 Controls</h2>

		<div class="control-group">
			<label>
				<input type="checkbox" bind:checked={multiSelect} />
				Multi-Select Mode
			</label>

			<label>
				<input type="checkbox" bind:checked={draggable} />
				Enable Drag & Drop
			</label>

			<label>
				<input type="checkbox" bind:checked={keyboardNav} />
				Keyboard Navigation
			</label>
		</div>

		<div class="button-group">
			<button onclick={addNewNode} class="btn btn-primary">
				<span>➕</span> Add Item
			</button>
			<button onclick={addNewFolder} class="btn btn-primary">
				<span>📁</span> Add Folder
			</button>
			<button onclick={renameSelected} class="btn btn-secondary">
				<span>✏️</span> Rename
			</button>
			<button onclick={deleteSelected} class="btn btn-error">
				<span>🗑️</span> Delete
			</button>
			<button onclick={expandAllNodes} class="btn btn-secondary">
				<span>📂</span> Expand All
			</button>
			<button onclick={collapseAllNodes} class="btn btn-secondary">
				<span>📁</span> Collapse All
			</button>
			<button onclick={clearSelections} class="btn btn-neutral">
				<span>🔄</span> Clear Selection
			</button>
		</div>
	</div>

	<div class="main-content">
		<div class="tree-section">
			<h2>📁 File Tree</h2>
			<div class="tree-wrapper">
				<Tree
					bind:this={treeComponent}
					nodes={treeData}
					{multiSelect}
					{draggable}
					keyboardNavigation={keyboardNav}
					onselect={handleSelect}
					onexpand={handleExpand}
					oncollapse={handleCollapse}
					onrename={handleRename}
					oncreate={handleCreate}
					ondelete={handleDelete}
					ondrop={handleDrop}
					onnodeschange={handleNodesChange}
					oncontextmenu={handleContextMenu}
				>
					{#snippet empty()}
						<div class="empty-state">
							<p>📭 No files or folders to display</p>
							<button onclick={addNewNode} class="btn btn-primary">Add First Item</button>
						</div>
					{/snippet}
				</Tree>
			</div>
		</div>

		<div class="side-panel">
			<div class="info-panel">
				<h2>ℹ️ Selection Info</h2>
				<div class="selection-display">
					{#if selectedInfo}
						<p class="selected-node">{selectedInfo}</p>
					{:else}
						<p class="empty-message">No node selected</p>
					{/if}
				</div>
			</div>

			<div class="info-panel event-panel">
				<div class="panel-header">
					<h2>📋 Event Log</h2>
					<button onclick={clearLog} class="btn-clear">Clear</button>
				</div>
				<div class="event-log">
					{#each eventLog as event}
						<div class="event-item">{event}</div>
					{/each}
					{#if eventLog.length === 0}
						<p class="empty-message">No events yet. Interact with the tree!</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	{#if contextMenu.visible}
		<div class="context-menu" style="top: {contextMenu.y}px; left: {contextMenu.x}px;">
			<button class="menu-item" onclick={() => handleContextAction('rename')}>
				<span>✏️</span> Rename
			</button>
			<button class="menu-item" onclick={() => handleContextAction('add-child')}>
				<span>➕</span> Add Item
			</button>
			<button class="menu-item" onclick={() => handleContextAction('add-folder')}>
				<span>📁</span> Add Folder
			</button>
			<div class="menu-divider"></div>
			<button class="menu-item delete" onclick={() => handleContextAction('delete')}>
				<span>🗑️</span> Delete
			</button>
		</div>
	{/if}

	<div class="instructions-section">
		<h2>⌨️ Keyboard Shortcuts</h2>
		<div class="shortcuts-grid">
			<div class="shortcut">
				<kbd>↓</kbd>
				<span>Next node</span>
			</div>
			<div class="shortcut">
				<kbd>↑</kbd>
				<span>Previous node</span>
			</div>
			<div class="shortcut">
				<kbd>→</kbd>
				<span>Expand / First child</span>
			</div>
			<div class="shortcut">
				<kbd>←</kbd>
				<span>Collapse / Parent</span>
			</div>
			<div class="shortcut">
				<kbd>Home</kbd>
				<span>First node</span>
			</div>
			<div class="shortcut">
				<kbd>End</kbd>
				<span>Last node</span>
			</div>
			<div class="shortcut">
				<kbd>Enter</kbd>
				<span>Toggle expand</span>
			</div>
			<div class="shortcut">
				<kbd>Space</kbd>
				<span>Select node</span>
			</div>
			<div class="shortcut">
				<kbd>F2</kbd>
				<span>Rename node</span>
			</div>
			<div class="shortcut">
				<kbd>Delete</kbd>
				<span>Delete node</span>
			</div>
			<div class="shortcut">
				<kbd>Ctrl+A</kbd>
				<span>Select all</span>
			</div>
			<div class="shortcut">
				<kbd>A-Z</kbd>
				<span>Jump to node</span>
			</div>
		</div>

		<h3>✨ Features & Instructions</h3>
		<ul>
			<li><strong>Select:</strong> Click on any node to select it</li>
			<li><strong>Multi-Select:</strong> Enable multi-select mode and Ctrl+Click nodes</li>
			<li><strong>Expand/Collapse:</strong> Click folder icons or use arrow keys</li>
			<li><strong>Rename:</strong> Double-click a node, press F2, or use the Rename button</li>
			<li><strong>Drag & Drop:</strong> Drag nodes to move them between folders (must be folders/containers)</li>
			<li><strong>Context Menu:</strong> Right-click any node for quick actions</li>
			<li><strong>Add Nodes:</strong> Select a folder and click Add Item/Folder buttons</li>
			<li><strong>Delete:</strong> Select nodes and click Delete or press Delete key</li>
			<li><strong>Keyboard Navigation:</strong> Full WAI-ARIA compliant keyboard support</li>
			<li><strong>Type-ahead Search:</strong> Press any letter to jump to matching nodes</li>
		</ul>

		<h3>💡 Tips</h3>
		<ul class="tips">
			<li>Folders can contain children, files cannot</li>
			<li>When dragging, you can only drop onto folders (nodes with children property)</li>
			<li>Press F2 to quickly rename the selected node</li>
			<li>Use keyboard shortcuts for faster navigation</li>
			<li>Right-click provides quick access to common actions</li>
			<li>All events are logged in the Event Log panel</li>
		</ul>
	</div>
</div>

<style>
	.demo-container {
		padding: 2rem;
		max-width: 1600px;
		margin: 0 auto;
		background-color: var(--color-base-100);
		color: var(--color-base-content);
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 2rem;
		color: var(--color-primary);
		text-align: center;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-base-content);
	}

	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
		color: var(--color-base-content);
	}

	.controls-section {
		background-color: var(--color-base-200);
		padding: 1.5rem;
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
		margin-bottom: 1.5rem;
	}

	.control-group {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.control-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
		font-weight: 500;
	}

	.control-group input[type='checkbox'] {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
	}

	.button-group {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		border: none;
		border-radius: var(--radius-field);
		font-weight: 500;
		font-size: 0.938rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn span {
		font-size: 1rem;
	}

	.btn-primary {
		background-color: var(--color-primary);
		color: var(--color-primary-content);
	}

	.btn-primary:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.btn-secondary {
		background-color: var(--color-secondary);
		color: var(--color-secondary-content);
	}

	.btn-secondary:hover {
		opacity: 0.9;
	}

	.btn-error {
		background-color: var(--color-error);
		color: var(--color-error-content);
	}

	.btn-error:hover {
		opacity: 0.9;
	}

	.btn-neutral {
		background-color: var(--color-neutral);
		color: var(--color-neutral-content);
	}

	.btn-neutral:hover {
		opacity: 0.9;
	}

	.main-content {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.tree-section {
		min-width: 0;
	}

	.tree-wrapper {
		background-color: var(--color-base-200);
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
		padding: 2rem;
		min-height: 400px;
		max-height: 600px;
		overflow: auto;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 2rem;
	}

	.empty-state p {
		margin-bottom: 1.5rem;
		font-size: 1.125rem;
		opacity: 0.7;
	}

	.side-panel {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.info-panel {
		background-color: var(--color-base-200);
		padding: 1.5rem;
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
		flex: 1;
		min-height: 0;
	}

	.event-panel {
		display: flex;
		flex-direction: column;
		flex: 2;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.panel-header h2 {
		margin-bottom: 0;
	}

	.btn-clear {
		padding: 0.375rem 0.75rem;
		font-size: 0.813rem;
		background-color: var(--color-base-300);
		color: var(--color-base-content);
		border: none;
		border-radius: var(--radius-field);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-clear:hover {
		background-color: var(--color-base-content);
		color: var(--color-base-100);
	}

	.selection-display {
		padding: 1rem;
		background-color: var(--color-base-300);
		border-radius: var(--radius-field);
	}

	.selected-node {
		font-family: monospace;
		font-size: 0.938rem;
		margin: 0;
		color: var(--color-primary);
		font-weight: 600;
	}

	.event-log {
		flex: 1;
		overflow-y: auto;
		min-height: 0;
	}

	.event-item {
		padding: 0.625rem 0.875rem;
		margin-bottom: 0.375rem;
		background-color: var(--color-base-300);
		border-radius: var(--radius-field);
		font-size: 0.875rem;
		font-family: monospace;
		border-left: 3px solid var(--color-primary);
		transition: all 0.15s ease;
	}

	.event-item:hover {
		background-color: var(--color-base-content);
		color: var(--color-base-100);
	}

	.empty-message {
		opacity: 0.6;
		font-style: italic;
		text-align: center;
		padding: 2rem;
	}

	.instructions-section {
		background-color: var(--color-base-200);
		padding: 2rem;
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
	}

	.shortcuts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.shortcut {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		background-color: var(--color-base-300);
		border-radius: var(--radius-field);
		transition: all 0.15s ease;
	}

	.shortcut:hover {
		background-color: var(--color-base-content);
		color: var(--color-base-100);
	}

	kbd {
		display: inline-block;
		padding: 0.375rem 0.75rem;
		background-color: var(--color-base-100);
		border: 2px solid var(--color-base-content);
		border-radius: var(--radius-field);
		font-family: monospace;
		font-size: 0.875rem;
		font-weight: 700;
		min-width: 3rem;
		text-align: center;
		box-shadow: 0 2px 0 var(--color-base-content);
	}

	.shortcut span {
		font-size: 0.875rem;
		color: var(--color-base-content);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	ul li {
		padding: 0.625rem 0;
		padding-left: 1.5rem;
		font-size: 0.938rem;
		position: relative;
	}

	ul li::before {
		content: '▸';
		position: absolute;
		left: 0;
		color: var(--color-primary);
		font-weight: bold;
	}

	ul li strong {
		color: var(--color-primary);
		font-weight: 600;
	}

	ul.tips li::before {
		content: '💡';
	}

	.context-menu {
		position: fixed;
		z-index: 1000;
		background: var(--color-base-100);
		border: 2px solid var(--color-base-300);
		border-radius: var(--radius-box);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.2),
			0 4px 6px -2px rgba(0, 0, 0, 0.1);
		padding: 0.5rem;
		min-width: 180px;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 1rem;
		font-size: 0.938rem;
		color: var(--color-base-content);
		background: transparent;
		border: none;
		border-radius: var(--radius-field);
		cursor: pointer;
		text-align: left;
		transition: all 0.15s ease;
		font-weight: 500;
	}

	.menu-item:hover {
		background: var(--color-primary);
		color: var(--color-primary-content);
		transform: translateX(2px);
	}

	.menu-item.delete:hover {
		background: var(--color-error);
		color: var(--color-error-content);
	}

	.menu-item span {
		font-size: 1rem;
	}

	.menu-divider {
		height: 2px;
		background: var(--color-base-300);
		margin: 0.25rem 0;
	}

	@media (max-width: 1200px) {
		.main-content {
			grid-template-columns: 1fr;
		}

		.side-panel {
			flex-direction: row;
		}
	}

	@media (max-width: 768px) {
		.demo-container {
			padding: 1rem;
		}

		h1 {
			font-size: 1.875rem;
		}

		.side-panel {
			flex-direction: column;
		}

		.shortcuts-grid {
			grid-template-columns: 1fr;
		}

		.button-group {
			width: 100%;
		}

		.btn {
			flex: 1;
			justify-content: center;
		}
	}
</style>
