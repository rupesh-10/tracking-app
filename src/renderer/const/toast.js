import vue from 'vue'

export default {
    showSuccessMessage(success) {
      vue.$toast.success(success)
    },

    showErrorMessage(error) {
       vue.$toast.danger(error)
      },
    }