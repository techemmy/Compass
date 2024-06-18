import { redirect } from "react-router-dom";
import api from "./api";

export async function createResoureceLoader() {
  try {
    const data = await api.get("/schools");
    return { data };
  } catch (error) {
    alert(`An error occured: ${error.message}`);
    return redirect("/home");
  }
}

export async function createResourceAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  formData.append("images", formData.getAll("images"));

  try {
    const createResourceReq = await api.post("/resources", data);

    if (!createResourceReq.status) {
      const errorMessage = createResourceReq.response.data.message;
      alert(errorMessage);
      return null;
    }

    const { data: createdResource } = createResourceReq;
    alert(`${createdResource.message}. Uploading images...`);

    const resourceId = createdResource.data._id;
    console.log(resourceId);

    console.log("uploading", formData.get("images"));
    const uploadResourceImgReq = await api.post(
      `/resources/upload-images/${resourceId}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log("uploaded:", uploadResourceImgReq);
    if (!uploadResourceImgReq.status) {
      const errorMessage = uploadResourceImgReq.response.data.message;
      console.log("what happened", errorMessage);
      alert(errorMessage);
      return null;
    }

    alert("Image uploaded successfully!");
    return redirect("/home");
  } catch (error) {
    console.log("error", error);
    return null;
  }
}