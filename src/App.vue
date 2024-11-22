<script setup lang="ts">
import { ref, shallowRef, defineAsyncComponent } from 'vue'
import RemoteComponent from './components/RemoteComponent.vue';
import { encodeToBase64 } from './utils/base64';


const remoteUrl = ref('');
const loadedComponents = ref<string[]>([]);

const exampleComponent = {
  template: `
    <div class="example-component">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button @click="count++">点击次数: {{ count }}</button>
    </div>
  `,
  script: `
    data() {
      return {
        title: '示例远程组件',
        message: '这是一个可交互的测试组件',
        count: 0
      }
    }
  `,
  style: `
    .example-component {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .example-component h2 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .example-component button {
      margin-top: 10px;
      background-color: #42b883;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .example-component button:hover {
      background-color: #3aa876;
    }
  `
};

const exampleComponentStr = encodeToBase64(exampleComponent);
const exampleUrl = `data:application/json;base64,${exampleComponentStr}`;

function addComponent() {
  if (remoteUrl.value && !loadedComponents.value.includes(remoteUrl.value)) {
    loadedComponents.value.push(remoteUrl.value);
    remoteUrl.value = '';
  }
}

function addExampleComponent() {
  if (!loadedComponents.value.includes(exampleUrl)) {
    loadedComponents.value.push(exampleUrl);
  }
}
</script>

<template>
  <div class="container">
    <h1>Vue 动态组件加载器</h1>

    <div class="input-section">
      <input v-model="remoteUrl" placeholder="输入远程组件URL" @keyup.enter="addComponent">
      <button @click="addComponent">加载组件</button>
      <button @click="addExampleComponent" class="example-btn">加载示例组件</button>
    </div>
    <div class="components-container">
      <div v-for="(url, index) in loadedComponents" :key="index" class="component-wrapper">
        <div class="component-header">
          <span class="component-url">{{ url.substring(0, 50) }}...</span>
          <button class="remove-btn" @click="loadedComponents.splice(index, 1)">
            移除
          </button>
        </div>
        <RemoteComponent :url="url" />
      </div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.input-section {
  margin: 2rem 0;
  display: flex;
  gap: 1rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #45a049;
}

.example-btn {
  background-color: #2196F3;
}

.example-btn:hover {
  background-color: #1976D2;
}

.components-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.component-wrapper {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.component-url {
  font-size: 0.9rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  background-color: #dc3545;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.remove-btn:hover {
  background-color: #c82333;
}

body {
  background-color: #f5f5f5;
  color: #333;
}
</style>