import { defineAsyncComponent, h, type Component } from 'vue';
import * as Vue from 'vue'
import { compile } from '@vue/compiler-dom';
import axios from 'axios';
import { decodeFromBase64 } from './base64';

interface RemoteModule {
  template?: string;
  script?: string;
  style?: string;
}

export async function loadRemoteComponent(url: string): Promise<Component> {
  try {
    let remoteModule: RemoteModule;

    if (url.startsWith('data:application/json;base64,')) {
      const base64Data = url.replace('data:application/json;base64,', '');
      remoteModule = decodeFromBase64(base64Data);
    } else {
      const response = await axios.get(url);
      remoteModule = response.data;
    }

    if (!remoteModule?.template) {
      throw new Error('组件模板不能为空');
    }

    // 编译模板
    const { code } = compile(remoteModule.template, {
      mode: 'function',
      hoistStatic: true,
      // prefixIdentifiers: true
    });

    // 创建渲染函数
    const render = new Function('Vue', code)(Vue);

    // 解析脚本内容
    let scriptContent = {};
    if (remoteModule.script) {
      const scriptFunction = new Function(`return {${remoteModule.script}}`);
      scriptContent = scriptFunction();
    }

    // 创建组件定义
    const componentDefinition = {
      ...scriptContent,
      render
    };

    // 添加样式
    if (remoteModule.style) {
      const styleId = `style-${Math.random().toString(36).substr(2, 9)}`;
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = remoteModule.style;
      document.head.appendChild(styleElement);

      // 在组件卸载时移除样式
      const originalUnmounted = componentDefinition.unmounted;
      componentDefinition.unmounted = function () {
        if (originalUnmounted) {
          originalUnmounted.call(this);
        }
        document.getElementById(styleId)?.remove();
      };
    }

    return defineAsyncComponent({
      loader: () => Promise.resolve(componentDefinition),
      timeout: 5000,
      errorComponent: {
        render: () => h('div', { class: 'error' }, '组件加载失败')
      },
      loadingComponent: {
        render: () => h('div', { class: 'loading' }, '加载中...')
      }
    });
  } catch (error) {
    console.error('加载远程组件失败:', error);
    throw error;
  }
}