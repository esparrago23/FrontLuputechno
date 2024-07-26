import React, { useRef, useState } from 'react';
import Label from "../atoms/Label";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import FormularioVehiculos from '../molecules/FormularioVehiculos';
import FormularioBuscar from '../molecules/FormularioBuscar';
import FormularioMotosEditar from '../molecules/FormularioMotosEditar';
import BotonMenu from '../molecules/BotonMenu';
import { useNavigate } from "react-router-dom";
const MySwal = withReactContent(Swal);

function MenuDiesel() {
    const inputValueRef = useRef('');
    const formRef = useRef({});
    const [form, setForm] = useState({});
    const navigate = useNavigate();
    const resetInputValue = () => {
        inputValueRef.current = '';
    };

    const handlerClickA = () => {
        MySwal.fire({
            title: 'Ingresa los datos',
            html: <FormularioVehiculos onChange={(values) => (formRef.current = values)} tipoVehiculo="Diesel"/>,
            showCloseButton: true,
            confirmButtonText: 'Agregar',
            preConfirm: () => {
                const values = formRef.current;
                if (!values || !values.someField) { 
                    Swal.showValidationMessage('Por favor, completa todos los campos');
                    return false; 
                }
                return values; 
            },
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${import.meta.env.VITE_URL_API}/Vehiculos`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        'Authorization': sessionStorage.getItem('token')
                    },
                    body: JSON.stringify(formRef.current)
                })
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Vehiculo agregado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
        });
    };

    const handlerClickE =  () => {
        MySwal.fire({
            title: 'Ingresa los datos del vehiculo',
            html: (
                <FormularioBuscar type="text" placeholder="No. económico"
                    onChange={(value) => {inputValueRef.current = value}}
                />
            ),
            showCloseButton: true, 
            confirmButtonText: 'Buscar',
            preConfirm: () => {
                if (!inputValueRef.current) {
                    Swal.showValidationMessage('Por favor ingresa el No. económico');
                    return false;
                }
                return inputValueRef.current;
            },
        }).then(async(result)  => {
            if (result.isConfirmed) {
            const response = await fetch(`${import.meta.env.VITE_URL_API}/Vehiculos/${inputValueRef.current}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': sessionStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('No existe ese Vehiculo');
            }
            const data = await response.json();
            setForm(data)
            MySwal.fire({
                title: 'Ingresa los datos del Vehiculo',
                html: <FormularioMotosEditar onChange={(values) => (formRef.current = values)} tipoVehiculo="Diesel" data={data}/>,
                showCloseButton: true,
                confirmButtonText: 'Editar',
                preConfirm: () => {
                    console.log(formRef.current)
                    const values = formRef.current;
                    if (!values || !values.someField) { 
                        Swal.showValidationMessage('Por favor, completa todos los campos');
                        return false; 
                    }
                    return values; 
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`${import.meta.env.VITE_URL_API}/Vehiculos/${inputValueRef.current}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            'Authorization': sessionStorage.getItem('token')
                        },
                        body: JSON.stringify(formRef.current)
                    })
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Vehiculo Editado correctamente.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                }
            })      
        }
        }).catch((error) => {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            });
        });
        resetInputValue();
    }

    const handlerClick = () => {
        MySwal.fire({
            title: 'Ingresa los datos del vehiculo',
            html: (
                <FormularioBuscar type="text" placeholder="No. económico"
                    onChange={(value) => {inputValueRef.current = value}}
                />
            ),
            showCloseButton: true, 
            confirmButtonText: 'Eliminar',
            preConfirm: () => {
                console.log(!inputValueRef.current)
                if (!inputValueRef.current) {
                    Swal.showValidationMessage('Por favor ingresa el No. económico');
                    return false;
                }
                return inputValueRef.current;
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                }).then((confirmationResult) => {
                    if (confirmationResult.isConfirmed) {
                        fetch(`${import.meta.env.VITE_URL_API}/Vehiculos/${inputValueRef.current}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "*",
                                'Authorization': sessionStorage.getItem('token')
                                }
                        }).then((response) => {
                            if (response.ok) {
                                Swal.fire({
                                    title: "Eliminado",
                                    text: "El elemento ha sido eliminado.",
                                    icon: "success"
                                });
                            } else {
                                return response.json().then(() => {
                                    throw new Error(`No existe ese Vehiculo`);
                                });
                            }
                        }).catch((error) => {
                            Swal.fire({
                                title: "Error",
                                text: error.message,
                                icon: "error"
                            });
                        });
                    }
                })
            }   
        })
        resetInputValue();
    };
    const NavigateToVizualizar =  () =>{
        navigate("/VerDiesel"); // redirige al usuario a la página de login o cualquier otra página
};

    return (
        <div className="mt-16">
            <div className="bg-slate-200 mb-4 text-xl text-center sm:text-2xl md:text-3xl lg:text-4xl text-stone-950">
                <Label className="m-2 font-bold" text="¡LISTO PARA TRABAJAR!" />
            </div>
            <div className="bg-slate-200 flex justify-evenly max-sm:grid max-sm:gap-4 sm:grid-cols-2 mt-16">
                <BotonMenu title={"Añadir"} image={"/Diesel.png"} onClick={handlerClickA} />
                <BotonMenu title={"Visualizar"} image={"/Diesel.png"} onClick={NavigateToVizualizar}/>
                <BotonMenu title={"Editar"} image={"/pen-svgrepo-com(2).svg"} onClick={handlerClickE} />
                <BotonMenu title={"Eliminar"} image={"/trash-xmark-svgrepo-com.svg"} onClick={handlerClick} />
            </div>
        </div>
    );
}

export default MenuDiesel;