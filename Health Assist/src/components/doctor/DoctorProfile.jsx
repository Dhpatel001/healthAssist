import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';

export const DoctorProfile = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  console.log("errors", errors)
  const navigate = useNavigate()


  const submitHandler = async (data) => {
    console.log(data)
    try{
    const userId = localStorage.getItem("id")
    data.userId = userId;
    console.log(data);
    console.log(data.image[0]);

    const formData = new FormData();
    formData.append("Firstname",data.Firstname)
    formData.append("Lastname",data.Lastname)
    formData.append("qualification",data.qualification)
    formData.append("specialization",data.specialization)
    formData.append("experience",data.experience)
    formData.append("availability",data.availability)
    formData.append("about",data.about)
    formData.append("image",data.image[0])
    formData.append("userId",data.userId)

    // const res = await axios.post("/adddoctor", data)
    const res = await axios.post("/adddocpic", formData)
    console.log(res) 
    console.log(res.data)

    if (res.status === 200) {
      //user added..
      //naviget
      toast.success('🦄 Form submitted Successfully!', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
        localStorage.setItem("id",res.data.data._id)
        // localStorage.setItem("role",res.data.data.roleId.name)

        // setTimeout(() => {
        //   navigate("/doctorinfo")
        // }, 1500);
                  navigate("/doctor/doctorinfo")

    }
     }
            catch (error) {
                        toast.error("Invalid email or password", {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    }
  };
  const validationSchema = {

    fnamevalidator: {
      required: {
        value: true,
        message: "First name required"
      }
    },
    lnamevalidator: {
      required: {
        value: true,
        message: "Last name required"
      }
    },
    qualificationvlidator: {
      required: {
        value: true,
        message: " required"
      }
    },
    specializationvalidator: {
      required: {
        value: true,
        message: " required"
      }
    },
    experiencevalidator: {
      required: {
        value: true,
        message: " required"
      }
    },
    aboutvalidator: {
      required: {
        value: true,
        message: " required"
      }
    }

  }
  return (
    <>
      <div className="card card-primary">
      <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            /> 
        <div className="card-header">
          <h3 className="card-title">Doctor Profile</h3>

        </div>
        <div className="card-body">

          <form onSubmit={handleSubmit(submitHandler)}>


            <div className="row">
              <div className="col-sm-6">
                {/* select */}
                <div className="form-group">
                  <label >Doctor First Name</label>
                  <input
                    type="text"

                    className="form-control"

                    {...register("Firstname", validationSchema.fnamevalidator)}
                  />
                  <span style={{ color: "red" }}>
                    {
                      errors.Firstname?.message
                    }
                  </span>
                </div>
              </div>


              <div className="col-sm-6">
                {/* select */}
                <div className="form-group">
                  <label htmlFor="inputName">Doctor Last Name</label>
                  <input
                    type="text"

                    className="form-control"

                    {...register("Lastname", validationSchema.lnamevalidator)}
                  />
                  <span style={{ color: "red" }}>
                    {
                      errors.Lastname?.message
                    }
                  </span>
                </div>
              </div>
            </div>




            <div className="form-group">
              <label htmlFor="inputClientCompany">Qualification</label>
              <input
                type="text"

                className="form-control"

                {...register("qualification", validationSchema.qualificationvlidator)}
              />
              <span style={{ color: "red" }}>
                {
                  errors.qualification?.message
                }
              </span>
            </div>
            <div className="form-group">
              <label >Specialties</label>
              <input
                type="text"

                className="form-control"

                {...register("specialization", validationSchema.specializationvalidator)}
              />
              <span style={{ color: "red" }}>
                {
                  errors.specialization?.message
                }
              </span>
            </div>
            <div className="form-group">
              <label >Experience</label>
              <input
                type="text"

                className="form-control"

                {...register("experience", validationSchema.experiencevalidator)}
              />
              <span style={{ color: "red" }}>
                {
                  errors.experience?.message
                }
              </span>
            </div>

            <div className="row">
            <div className="col-sm-6">
              {/* select */}
              <div className="form-group">
                <label>availability</label>
                <select className="form-control" {...register("availability")}>
                  <option>morning</option>
                  <option>afternoon</option>
                  <option>evening</option>
                  <option>night</option>
                  <option>fulltime</option>
                </select>
              </div>
              </div>
              
              <div className="col-sm-6">
              {/* select */}
              <div className="form-group">
                <label>Select</label>
                <select className="form-control">
                  <option>option 1</option>
                  <option>option 2</option>
                  <option>option 3</option>
                  <option>option 4</option>
                  <option>option 5</option>
                </select>
              </div>
              </div>
            </div>



            <div className="form-group">
              <label >About</label>
              <textarea

                className="form-control"
                rows={4}

                {...register("about", validationSchema.aboutvalidator)}
              />
              <span style={{ color: "red" }}>
                {
                  errors.about?.message
                }
              </span>
            </div>
            <div className="form-group">
              {/* <label for="customFile">Custom File</label> */}
              <div className="custom-file">
                <input type="file" className="custom-file-input" id="customFile" {...register("image")} />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose file
                </label>
              </div>
            </div>

            <button type="submit" className="custom-submit-button">
              Register
            </button>
          </form>
        </div>
        {/* /.card-body */}
      </div>
    </>
  )
}
