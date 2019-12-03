jQuery(document).ready($=> {
  let queue = {};
  let form = $("form#uploadImages");
  let imagesList = $("#uploadImagesList");
  let itemPreviewTemplate = imagesList.find(".item.template").clone();
  itemPreviewTemplate.removeClass("template");
  imagesList.find(".item.template").remove();

  $("#customFile").on("change", function() {
    let files = this.files;

    for (let i = 0; i < files.length; i++) {
      preview(files[i]);
    }

    this.value = "";
  });

  // Создание превью
  const preview=file=> {
    let reader = new FileReader();
    reader.addEventListener("load", event => {
      let img = document.createElement("img");

      let itemPreview = itemPreviewTemplate.clone();

      itemPreview.find(".img-wrap img").attr("src", event.target.result);
      itemPreview.data("id", file.name);

      imagesList.append(itemPreview);

      queue[file.name] = file;
    });
    reader.readAsDataURL(file);
  }

  // Удаление фотографий
  imagesList.on("click", ".close",function(){
    let item = $(this).closest(".item"),
      id = item.data("id");

    delete queue[id];

    item.remove();
  });

  // Отправка формы
  form.on("submit", ()=> {
    let formData = new FormData(this);

    for (let id in queue) {
      formData.append("images[]", queue[id]);
    }

    $.ajax({
      url: $(this).attr("action"),
      type: "POST",
      data: formData,
      async: true,
      success: res => {
        alert(res);
      },
      cache: false,
      contentType: false,
      processData: false
    });
    console.log({formData});
    return false;
  });
});
