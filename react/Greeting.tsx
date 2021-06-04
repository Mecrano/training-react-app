import React, { useEffect, useState } from 'react'
import { Button } from 'vtex.styleguide'
import { useLazyQuery } from 'react-apollo'

import GET_DOCUMENTS from './graphql/query.getDocuments.gql'

type Props = {
  email: string
}

function Greeting({ email }: Props) {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [loadGreeting, { called, loading, error, data }] = useLazyQuery(
    GET_DOCUMENTS
  )

  const getUser = () => {
    loadGreeting({
      variables: {
        acronym: 'CL',
        fields: ['lastName'],
        where: `email=${email}`,
      },
    })
  }

  const getFieldDef = (fields: any, nameField: any) => {
    const field = fields?.documents[0].fields.find(
      ({ key }: any) => key === nameField
    )

    return field?.value
  }

  useEffect(() => {
    if (!loading && called) {
      if (error) {
        console.error('Error', error)
      } else {
        // eslint-disable-next-line no-console
        console.log(data)
        const nombre: string = getFieldDef(data, 'lastName')
        const apellido: string = getFieldDef(data, 'lastName')

        if (nombre) {
          setFirstName(nombre)
        }

        if (apellido) {
          setLastName(apellido)
        }
      }
    }
  }, [called, loading, error, data])

  return (
    <>
      {firstName && lastName ? (
        <div>Hola, {`${firstName} ${lastName}`}</div>
      ) : (
        <p>Sin Data</p>
      )}
      <Button variation="primary" onClick={() => getUser()}>
        Consultar
      </Button>
    </>
  )
}

export default Greeting
