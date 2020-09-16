new Vue({
  el: '#app',
  data() {
    return {
      isDark: true,
      show: true,
      todoTitle: '',
      todos: [],
    };
  },
  created() {
    fetch('/api/todo', {
      method: 'get',
    })
      .then((res) => res.json())
      .then((todos) => (this.todos = todos))
      .catch((e) => console.error('e', e));
  },
  methods: {
    addTodo() {
      const title = this.todoTitle.trim();

      if (!title) {
        return;
      }

      fetch('/api/todo', {
        method: 'post',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({ title }),
      })
        .then((res) => res.json())
        .then(({ todo }) => {
          this.todos.push(todo);
          this.todoTitle = '';
        })
        .catch((e) => console.error('e', e));

      this.todoTitle = '';
    },
    removeTodo(id) {
      fetch(`/api/todo/${id}`, {
        method: 'delete',
      })
        .then(() => {
          this.todos = this.todos.filter((t) => t.id !== id);
        })
        .catch((e) => console.error('e', e));
    },
    completeTodo(id) {
      fetch(`/api/todo/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: true }),
      })
        .then((res) => res.json())
        .then(({ todo }) => {
          const idx = this.todos.findIndex(({ id }) => id === todo.id);

          this.todos[idx].updatedAt = todo.updatedAt;
        })
        .catch((e) => console.error('e', e));
    },
  },
  filters: {
    capitalize(value) {
      return (
        value
          .toString()
          .charAt(0)
          .toUpperCase() + value.slice(1)
      );
    },
    date(value, withTime) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      };

      if (withTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
      }
      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value));
    },
  },
});