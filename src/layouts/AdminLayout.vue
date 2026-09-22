<template>
    <div id="app">
        <SideMenu />
        <div class="main">
            <TopBar v-model:keyword="globalSearch" />
            <div class="content">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SideMenu from '@/components/SideMenu.vue'
import TopBar from '@/components/TopBar.vue'

const globalSearch = ref('')
</script>

<style scoped>
.main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px 40px;
}

.content::-webkit-scrollbar {
    width: 8px;
}

.content::-webkit-scrollbar-thumb {
    background: #dbe2ea;
    border-radius: 4px;
}
</style>