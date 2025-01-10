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
        accept="image/*"
        @change="handleFileSelect"
        ref="fileInput"
      >
      <p>Sleep afbeelding hierheen of klik om te selecteren</p>
    </div>

    <div v-if="isUploading" class="upload-status">
      Uploading...
    </div>

    <div class="image-previews" v-if="imageUrl">
      <div class="preview-container">
        <img :src="`http://localhost:3100${imageUrl}#/`" alt="Preview"> 
        <!-- Enkel voor development op deze schaal -->
        <button type="button" @click="removeImage">×</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: 'ImageUpload',
data() {
  return {
    isDragging: false,
    imageUrl: null,
    isUploading: false,
  };
},
methods: {
  async handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      await this.uploadFile(file);
    }
  },

  async handleDrop(event) {
    this.isDragging = false;
    const file = event.dataTransfer.files[0];
    if (file) {
      await this.uploadFile(file);
    }
  },

  async uploadFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Alleen afbeeldingen zijn toegestaan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Bestand mag niet groter zijn dan 5MB');
      return;
    }

    try {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3100/api/campingImageUpload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      this.imageUrl = data.imageUrl;
      // Emit the URL to parent component
      this.$emit('image-uploaded', data.imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Er ging iets mis bij het uploaden van de afbeelding');
    } finally {
      this.isUploading = false;
    }
  },

  removeImage() {
    this.imageUrl = null;
    this.$refs.fileInput.value = ''; // Reset file input
    this.$emit('image-uploaded', null);
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