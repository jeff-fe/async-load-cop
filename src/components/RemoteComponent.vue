<script setup lang="ts">
import { ref, shallowRef, onMounted, defineProps, onUnmounted } from 'vue';
import { loadRemoteComponent } from '../utils/componentLoader';

const props = defineProps<{
  url: string;
}>();

const DynamicComponent = shallowRef<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const componentInstance = shallowRef<any>(null);

onMounted(async () => {
  try {
    DynamicComponent.value = await loadRemoteComponent(props.url);
    loading.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载组件失败';
    loading.value = false;
    console.error('组件加载错误:', e);
  }
});

onUnmounted(() => {
  if (componentInstance.value?.unmounted) {
    componentInstance.value.unmounted();
  }
});
</script>

<template>
  <div class="remote-component">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      加载中...
    </div>
    <div v-else-if="error" class="error">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
    <component v-else :is="DynamicComponent" ref="componentInstance" />
  </div>
</template>

<style scoped>
.remote-component {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: #666;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error {
  padding: 1rem;
  color: #ff4444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fff5f5;
  border-radius: 4px;
}

.error-icon {
  font-size: 1.2em;
}
</style>