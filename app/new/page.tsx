"use client"
import { useClerkJWT } from '../../hooks/useClerkJWT'
import React, { useEffect } from 'react'

const ExampleUsage = () => {
  const {getJWT,isLoaded,isSignedIn} = useClerkJWT()

  useEffect(() => {
    if(isLoaded && isSignedIn){
      getJWT().then((jwt: string | null) => {
        console.log("JWT:", jwt);
      }).catch((error: any) => {
        console.error("Error fetching JWT:", error);
      });
    }
  }, [isLoaded, isSignedIn])

  const gettoken = async () => {
    try {
      const token = await getJWT();
      console.log("JWT Token:", token);
    } catch (error) {
      console.error("Error fetching JWT token:", error);
    }
  };

  return (
    <div>ExampleUsage</div>
  )
}

export default ExampleUsage