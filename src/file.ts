import * as fs from 'fs'

export default class StackOutputFile {
  constructor (
    public path: string
  ) { }

  public convertCreateReactAppEnv (data: object) {
    let str = '';
    for (var key in data) {
      if (data.hasOwnProperty(key)) {           
          str += `REACT_APP_${key}=${data[key]}\n`;
      }
    }
    return str
  }

  public format (data: object) {
    const ext = this.path.split('.').pop() || ''

    switch (ext.toUpperCase()) {
      case 'JSON':
        return JSON.stringify(data, null, 2)
      case 'TOML':
        return require('tomlify-j0.4')(data, null, 0)
      case 'YAML':
      case 'YML':
        return require('yamljs').stringify(data)
      case 'REACT_APP':
        return this.convertCreateReactAppEnv(data)
      default:
        throw new Error('No formatter found for `' + ext + '` extension')
    }
  }

  public save (data: object) {
    const content = this.format(data)

    try {
      fs.writeFileSync(this.path, content)
    } catch (e) {
      throw new Error('Cannot write to file: ' + this.path)
    }

    return Promise.resolve()
  }
}
