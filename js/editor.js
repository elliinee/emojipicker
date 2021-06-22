/**
 * Редактор
 */
class Editor {
  constructor(element) {
    /**
     * Родитеский элемент для наполнения
     */
    this.ref = element;
    /**
     * Индикатор видимости выпадающего интерфейса
     */
    this.open = false;

    /**
     * Инициализируем элементы редактора
     */
    this.textareaInit();
    this.buttonEmojiInit();
    this.setEmojiInit();
  }

  /**
   * Инициализация textarea
   */
  textareaInit() {
    /**
     * Нужен общий родитель для textarea и кнопки с emoji т.к. будем позицианировать кнопку абсолютно
     */
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("wrapper");

    this.textarea = document.createElement("textarea");
    this.textarea.placeholder = "Ваше сообщение";
    this.textarea.rows = 1;

    /**
     * Вешаем обработчик для изменения высоты при вводе текста
     */
    this.textarea.addEventListener("input", (e) => {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = e.target.scrollHeight + 2 + "px";
    });


    this.wrapper.appendChild(this.textarea);

    this.ref.appendChild(this.wrapper);
  }

  /**
   * Инициализация кнопки с emoji
   */
  buttonEmojiInit() {
    this.button = document.createElement("div");

    this.button.classList.add("button_emoji");

    this.button.addEventListener("click", (e) => {
      /**
       * Т.к. категории будут находиться внутри кнопки, нужно обработать клик именно на саму кнопку
       */
      if (!e.target.classList.contains("button_emoji")) return;

      if (this.open) {
        this.closeSetEmoji();
      } else {
        this.openSetEmoji();
      }
    });

    this.wrapper.appendChild(this.button);
  }

  /**
   * Инициализация категорий emoji
   */
  setEmojiInit() {
    
    this.setEmoji = document.createElement("div");
    const tabs = document.createElement("div");
    const tabAll = document.createElement("div");
    const tabUsed = document.createElement("div");

    
    tabs.classList.add("tabs");
    tabAll.classList.add("tab");
    tabAll.classList.add("all");
    tabAll.classList.add("current");
    tabUsed.classList.add("tab");
    tabUsed.classList.add("used");


    tabs.appendChild(tabAll);
    tabs.appendChild(tabUsed);
    

    tabAll.addEventListener("click", () => {
      tabAll.classList.add("current");
      tabUsed.classList.remove("current");
      this.renderCategory(emoji, tabs);

    });

    tabUsed.addEventListener("click", () => {
      tabAll.classList.remove("current");
      tabUsed.classList.add("current");
      /**
       * Имитируем список emoji получая используемые ранее из localStorage
       */
      this.renderCategory(
        [
          {
            title: "Последние",
            items: JSON.parse(localStorage.getItem("used_emoji") || "[]"),
          },
        ],
        tabs
      );
    });

    
    this.setEmoji.classList.add("set_emoji");

    this.renderCategory(emoji, tabs);
  }

  /**
   * Рендерим категории
   */
  renderCategory(list, tabs) {
    /**
     * Очищаем сперва
     */
    this.setEmoji.innerHTML = "";

    
    const catWr = document.createElement("div");
    catWr.classList.add("categ-wrap");
    /**
     * Пройдемся по списку категорий и добавим их
     */
    list.forEach((a) => {
      
      const category = document.createElement("div");
      const title = document.createElement("div");
      const content = document.createElement("div");

      
      category.classList.add("category");
      content.classList.add("content");

      title.classList.add("title");
      title.innerHTML = a.title;

      /**
       * Пройдемся по списку emoji и добавим их
       * Если список пуст, то отобразим заглушку
       */
      if (a.items.length > 0) {
        a.items.forEach((b) => {
          const item = document.createElement("div");

          item.classList.add("emoji");
          item.innerHTML = b;
          item.addEventListener("click", () => this.insertEmoji(b));

          content.appendChild(item);
        });
      } else {
        content.innerHTML = "Нет данных"
      }

      category.appendChild(title);
      category.appendChild(content);

      this.setEmoji.appendChild(catWr);
      catWr.appendChild(category);

    });
    
    this.setEmoji.appendChild(tabs);
    
    
  }

/**
   * Отдельные табы
   */
    


  /**
   * Открываем выпадающий интерфейс
   */
  openSetEmoji() {
    this.setEmojiInit();
    this.textarea.focus();
    this.button.appendChild(this.setEmoji);
    this.open = true;
  }

  /**
   * Скрываем выпадающий интерфейс
   */
  closeSetEmoji() {
    this.textarea.focus();
    this.button.removeChild(this.setEmoji);
    this.open = false;
  }

  /**
   * Вставка emoji в поле для ввода текста
   */
  insertEmoji(emoji) {
    /**
     * Это позволит вставить emoji в место где находится курсор
     */
    if (this.textarea.selectionStart || this.textarea.selectionStart == "0") {
      const startPos = this.textarea.selectionStart;
      const endPos = this.textarea.selectionEnd;

      this.textarea.value =
        this.textarea.value.substring(0, startPos) +
        emoji +
        this.textarea.value.substring(endPos, this.textarea.value.length);

      this.textarea.selectionStart = startPos + emoji.length;
      this.textarea.selectionEnd = startPos + emoji.length;
    } else {
      this.textarea.value += emoji;
    }

    this.closeSetEmoji();
    this.saveUsedEmoji(emoji);
  }

  /**
   * Сохраняем используемые emoji в localStorage
   */
  saveUsedEmoji(emoji) {
    const usedEmoji = JSON.parse(
      localStorage.getItem("used_emoji") || "[]"
    ).filter((a) => a !== emoji);

    localStorage.setItem("used_emoji", JSON.stringify([emoji, ...usedEmoji]));
  }

  /**
   * Расчет высоты поля для ввода текста при его изменение
   */
  calcHeight(value) {
    const numberOfLineBreaks = (value.match(/\n/g) || []).length;
    // min-height / 2 + lines x line-height + padding + border
    const newHeight = 20 + numberOfLineBreaks * 17 + 20;
    return newHeight;
  }

  /**
   * Подсвечивание
   */

  

}

const element = document.getElementById("editor");

/**
 * Инициализация
 */
const editor = new Editor(element);
