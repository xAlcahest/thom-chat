<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Icons from '$lib/components/icons';
	import { authClient } from '$lib/backend/auth/client.js';
	import DeviconGoogle from '~icons/devicon/google';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let isSignUp = $state(false);
	let error = $state('');
	let loading = $state(false);

	async function signInGitHub() {
		await authClient.signIn.social({ provider: 'github', callbackURL: '/chat' });
	}

	async function signInGoogle() {
		await authClient.signIn.social({ provider: 'google', callbackURL: '/chat' });
	}

	async function handleEmailAuth() {
		error = '';
		loading = true;
		try {
			if (isSignUp) {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || email.split('@')[0] || 'User',
				});
				if (res.error) {
					error = res.error.message ?? 'Sign up failed';
					return;
				}
			} else {
				const res = await authClient.signIn.email({ email, password });
				if (res.error) {
					error = res.error.message ?? 'Sign in failed';
					return;
				}
			}
			goto('/chat');
		} catch (e) {
			error = e instanceof Error ? e.message : 'Something went wrong';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex h-svh flex-col place-items-center justify-center gap-4">
	<h1 class="text-2xl font-bold">Sign in to thom.chat</h1>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleEmailAuth();
		}}
		class="flex w-72 flex-col gap-3"
	>
		{#if isSignUp}
			<input
				type="text"
				bind:value={name}
				placeholder="Name"
				class="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
			/>
		{/if}
		<input
			type="email"
			bind:value={email}
			placeholder="Email"
			required
			class="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
		/>
		<input
			type="password"
			bind:value={password}
			placeholder="Password"
			required
			minlength="8"
			class="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
		/>
		{#if error}
			<p class="text-sm text-red-500">{error}</p>
		{/if}
		<Button type="submit" disabled={loading}>
			{isSignUp ? 'Sign up' : 'Sign in'} with Email
		</Button>
		<button
			type="button"
			class="text-sm text-neutral-500 hover:underline"
			onclick={() => {
				isSignUp = !isSignUp;
				error = '';
			}}
		>
			{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
		</button>
	</form>

	<div class="flex w-72 items-center gap-3">
		<div class="h-px flex-1 bg-neutral-300 dark:bg-neutral-700"></div>
		<span class="text-xs text-neutral-500">or</span>
		<div class="h-px flex-1 bg-neutral-300 dark:bg-neutral-700"></div>
	</div>

	<Button variant="outline" onClickPromise={signInGitHub}>
		<Icons.GitHub /> Continue with GitHub
	</Button>
	<Button variant="outline" onClickPromise={signInGoogle}>
		<DeviconGoogle /> Continue with Google
	</Button>
</div>
