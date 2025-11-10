<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h2 class="title">Categories</h2>
      <div class="flex gap-2">
        <input v-model="q" placeholder="Search name..." class="input w-60" @input="debouncedFetch" />
        <button class="btn-primary" @click="openCreate">Add</button>
      </div>
    </header>

    <div class="grid md:grid-cols-3 gap-4">
      <div v-for="c in items" :key="c.id" class="card flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="inline-block size-5 rounded-full" :style="{ background: c.color || '#e5e7eb' }"></span>
          <div>
            <p class="font-medium">{{ c.name }}</p>
            <p class="text-xs text-gray-500">{{ c.color || '—' }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="text-emerald-700 text-sm border font-semibold hover:text-slate-50 hover:bg-emerald-700 border-emerald-700 rounded-xl px-2 py-0" @click="edit(c)">Edit</button>
          <button class="text-red-700 text-sm border font-semibold hover:text-slate-50 hover:bg-red-700 border-red-700 rounded-xl px-2 py-0" @click="removeCat(c)">Delete</button>
        </div>
      </div>
      <p v-if="items.length===0" class="col-span-full text-center text-gray-500">No categories</p>
    </div>

    <dialog ref="dlg" class="modal">
      <form method="dialog" class="card w-full max-w-md" @submit.prevent>
        <h3 class="title mb-4">{{ form.id ? 'Edit' : 'Add' }} Category</h3>
        <div class="space-y-4">
          <div><label class="block text-sm">Name</label><input v-model="form.name" class="input" required /></div>
          <div><label class="block text-sm">Color (HEX)</label><input type="color" v-model="form.color" class="input" placeholder="#10b981" /></div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button class="btn-ghost" @click="close">Cancel</button>
          <button class="btn-primary" @click="save">Save</button>
        </div>
      </form>
    </dialog>
  </section>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import api from '@/lib/api'

const items = ref([])
const q = ref('')
const form = reactive({ id:null, name:'', color:'' })
const dlg = ref(null)

const fetchList = async () => {
  const { data } = await api.get('/categories', { params: { q: q.value, per_page: 100 } })
  items.value = data.data ?? data
}
const openCreate = () => { Object.assign(form, { id:null, name:'', color:'' }); dlg.value?.showModal() }
const edit = (c) => { Object.assign(form, c); dlg.value?.showModal() }
const close = () => dlg.value?.close()
const save = async () => {
  if (form.id) await api.put(`/categories/${form.id}`, form)
  else await api.post('/categories', form)
  close(); await fetchList()
}
const removeCat = async (c) => { if (confirm('Delete this category?')) { await api.delete(`/categories/${c.id}`); await fetchList() } }
const debouncedFetch = (() => { let h; return () => { clearTimeout(h); h = setTimeout(fetchList, 300) }})()

onMounted(fetchList)
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  border: none;
  padding: 0;
}
.modal::backdrop {
  background: rgba(0, 0, 0, 0.7);
}
</style>
