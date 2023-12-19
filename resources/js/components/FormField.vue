<template>
  <DefaultField :field="field">
    <template #field>
      <div class="flex flex-wrap">
        <div
          class="w-full"
          v-for="(column, columnIndex) in chunkedOptions"
          :key="columnIndex"
          :style="{ width: columnWidth }"
        >
          <ul class="list-reset">
            <li
              class="flex items-center mb-4"
              v-for="(option, optionIndex) in column"
              :key="`option-${optionIndex}`"
            >
              <checkbox
                class="py-2 mr-4"
                @input="handleChange(option.value)"
                :name="field.name"
                :checked="options[option.value]"
              ></checkbox>
              <label
                v-text="option.label"
                @click="handleChange(option.value)"
              ></label>
            </li>
          </ul>
        </div>
      </div>

      <p v-if="hasError" class="my-2 text-red-500">
        {{ firstError }}
      </p>
    </template>
  </DefaultField>
</template>

<script>
import { FormField, HandlesValidationErrors } from "laravel-nova";

export default {
  mixins: [FormField, HandlesValidationErrors],

  data: () => ({
    value: "",
    options: [],
  }),

  props: ["resourceName", "resourceId", "field"],

  computed: {
    optionValues() {
      return this.field.options
        .map((o) => o.value)
        .reduce((o, key) => ({ ...o, [key]: this.value.includes(key) }), {});
    },

    chunkedOptions() {
      const chunks = [];
      const chunkSize = Math.ceil(
        this.field.options.length / this.field.columns
      );
      for (let i = 0; i < this.field.options.length; i += chunkSize) {
        chunks.push(this.field.options.slice(i, i + chunkSize));
      }
      return chunks;
    },

    columnWidth() {
      return `${100 / this.field.columns}%`;
    },
  },

  mounted() {
    this.setInitialValue();
  },

  methods: {
    setInitialValue() {
      this.value = this.field.value || "";
      this.$nextTick(() => {
        this.options = this.value ? JSON.parse(this.value) : [];
      });
    },

    fill(formData) {
      formData.append(this.field.attribute, JSON.stringify(this.options) || "");
    },

    handleChange(key) {
      this.$set(this.options, key, !this.options[key]);
    },
  },

  watch: {
    options: {
      handler: function (newOptions) {
        this.value = JSON.stringify(newOptions);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.checkbox-container {
  display: flex;
  flex-wrap: wrap;
}
.checkbox-container > div {
  flex-basis: calc(100% / 2); /* Adjust based on the number of columns */
  box-sizing: border-box;
}
</style>
