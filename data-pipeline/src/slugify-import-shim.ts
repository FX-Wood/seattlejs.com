/**
 * Hack to make 'slugify' import work with "type": "module".
 * see https://github.com/simov/slugify/issues/173
 */
import slugify from 'slugify'

export default slugify as unknown as typeof slugify.default
