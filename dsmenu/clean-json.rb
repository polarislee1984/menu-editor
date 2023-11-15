require 'json'

Dir['*.json'].each do |file|

  next if file.include?('clean')

  data = JSON.parse(File.read(file))

  data['canvas'] = JSON.parse(data['canvas'])

  File.open(file.sub('.json', '-clean.json'), 'w') do |f|
    f.write(JSON::pretty_generate(data))
  end
end
