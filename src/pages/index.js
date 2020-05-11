import React from 'react'
import { Link } from 'gatsby'
import Seo from '../components/Seo'

const Index = () => {
  return (
    <div>
      <Seo title='Blog Markdown' description='Um blog com Markdown' />

      <h1>Index</h1>

      <p>
        <Link to='/blog'>Blog</Link>
      </p>
    </div>
  )
}

export default Index
