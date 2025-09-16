<template>
  <div class="p-6 lg:p-12">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">
          <slot name="title"></slot>
        </h1>
        <p class="text-muted-foreground">
          <slot name="subtitle"></slot>
        </p>
      </div>
      <slot name="button"></slot>
    </div>

    <slot name="content"></slot>
    <slot name="modal"></slot>
  </div>
</template>
