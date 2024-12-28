<!-- components/ImageUpload.vue -->
<template>
    <div>
      <div 
        class="image-upload-area" 
        :class="{ 'dragover': isDragging }"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <input 
          type="file" 
          multiple 
          accept="image/*"
          @change="handleFileSelect"
        >
        <p>Sleep afbeeldingen hierheen of klik om te selecteren</p>
      </div>
  
      <div class="image-previews" v-if="imagePreviewUrls && imagePreviewUrls.length">
        <div v-for="(preview, index) in imagePreviewUrls" :key="index" class="preview-container">
          <img :src="preview" :alt="'Preview ' + (index + 1)">
          <button type="button" @click="removeImage(index)">×</button>
        </div>
      </div>
    </div>
  </template>
  
<script>
export default {
  name: 'ImageUpload',
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      imagePreviewUrls: [],
      isDragging: false,
    };
  },
  methods: {
    handleFileSelect(event) {
      this.addFiles(event.target.files);
    },
  
    handleDrop(event) {
      this.isDragging = false;
      this.addFiles(event.dataTransfer.files);
    },
  
    addFiles(files) {
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          alert('Alleen afbeeldingen zijn toegestaan');
          return;
        }
  
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert('Bestand mag niet groter zijn dan 5MB');
          return;
        }
  
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            data: e.target.result,
            type: file.type,
            name: file.name,
          };
          // Update both the parent's images and local preview URLs
          this.$emit('update:images', [...this.images, imageData]);
          this.imagePreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },
  
    removeImage(index) {
      const newImages = [...this.images];
      newImages.splice(index, 1);
      this.$emit('update:images', newImages);
      this.imagePreviewUrls.splice(index, 1);
    },
  },
};
</script>
  
<style scoped>
.image-upload-area {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  margin: 10px 0;
  cursor: pointer;
}

.image-upload-area.dragover {
  border-color: #2196F3;
  background-color: #E3F2FD;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.preview-container {
  position: relative;
}

.preview-container img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.preview-container button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: none;
}

.preview-container:hover button {
  display: block;
}
</style>