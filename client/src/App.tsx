import {
  Box,
  List,
  ThemeIcon,
  Button,
  Space,
  Card,
  ActionIcon,
} from '@mantine/core'
import { CheckCircleFillIcon } from '@primer/octicons-react'
import useSWR from 'swr'
import './App.css'
import { AddTodo } from './components/AddTodo'
import axios from 'axios'

export interface Todo {
  id: number
  title: string
  body: string
  done: boolean
}

export const ENDPOINT = 'http://localhost:4000'

const fetcher = (url: string) =>
  axios.get(`${ENDPOINT}/${url}`).then((res) => res.data)

function App() {
  const { data, mutate } = useSWR<Todo[]>('api/todos', fetcher)

  async function markTodoAsDone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: 'PATCH',
    }).then((res) => res.json())

    mutate(updated)
  }

  async function deleteHandler(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/delete`, {
      method: 'DELETE',
    }).then((res) => res.json())

    mutate(updated)
  }

  return (
    <Box
      sx={(theme) => ({
        padding: '2rem',
        width: '100%',
        maxWidth: '50rem',
        margin: '0 auto',
      })}
    >
      <List spacing="md" size="sm" mb={12} center>
        {data?.map((todo) => {
          return (
            <Card
              key={`todo__${todo.id}`}
              style={{
                display: 'flex',
                backgroundColor: 'transparent',
              }}
              mb={12}
            >
              <ActionIcon
                mr={5}
                variant="filled"
                color={todo.done ? 'teal' : 'red'}
                onClick={() => markTodoAsDone(todo.id)}
              >
                <CheckCircleFillIcon />
              </ActionIcon>
              {todo.title}
              <Button
                color="red"
                compact
                onClick={() => deleteHandler(todo.id)}
                style={{ marginLeft: 'auto' }}
              >
                X
              </Button>
            </Card>
          )
        })}
      </List>
      <AddTodo mutate={mutate} />
    </Box>
  )
}

export default App
