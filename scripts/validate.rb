require 'yaml'
require 'date'
require 'uri'
require 'pathname'

root = File.expand_path('..', __dir__)
errors = []
def frontmatter(path, errors)
  text = File.read(path, encoding: 'UTF-8')
  match = text.match(/\A---\s*\r?\n(.*?)\r?\n---\s*(?:\r?\n|\z)(.*)/m)
  unless match
    errors << "#{path}: missing frontmatter"
    return [{}, '']
  end
  data = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: false)
  raise 'frontmatter must be a mapping' unless data.is_a?(Hash)
  [data, match[2]]
rescue StandardError => e
  errors << "#{path}: #{e.message}"
  [{}, '']
end

drawers = {}
Dir.glob("#{root}/_drawers/*.md").sort.each do |path|
  data, = frontmatter(path, errors)
  errors << "#{path}: permalink and slug are reserved" if data.key?('permalink') || data.key?('slug')
  key = data['key']
  errors << "#{path}: key must match filename" unless key.is_a?(String) && key.match?(/\A[a-z0-9-]+\z/) && key == File.basename(path, '.md')
  errors << "#{path}: duplicate category key" if drawers.key?(key)
  %w[title label description].each { |k| errors << "#{path}: #{k} must be a nonempty string" unless data[k].is_a?(String) && !data[k].strip.empty? }
  errors << "#{path}: order must be a number" unless data['order'].is_a?(Numeric)
  drawers[key] = true
end
ids = {}
Dir.glob("#{root}/_items/**/*.{md,markdown}").sort.each do |path|
  data, body = frontmatter(path, errors)
  errors << "#{path}: permalink and slug are reserved" if data.key?('permalink') || data.key?('slug')
  id = data['item_id']
  errors << "#{path}: item_id must match filename and contain only lowercase letters, digits and hyphens" unless id.is_a?(String) && id.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/) && id == File.basename(path).sub(/\.(md|markdown)\z/, '')
  errors << "#{path}: duplicate item_id #{id}" if ids.key?(id)
  ids[id] = true
  errors << "#{path}: unknown type" unless %w[text image media link daily other].include?(data['type'])
  errors << "#{path}: unknown category" unless drawers.key?(data['category'])
  begin
    value = data['date']
    raise 'missing date' if value.nil?
    Date.iso8601(value.to_s[0,10])
  rescue ArgumentError, TypeError, RuntimeError
    errors << "#{path}: date must be YYYY-MM-DD"
  end
  errors << "#{path}: body must not be empty" if body.strip.empty?
  %w[title note cover_alt creator medium].each { |k| errors << "#{path}: #{k} must be a string" if data.key?(k) && !data[k].is_a?(String) }
  errors << "#{path}: tags must be an array of strings" if data.key?('tags') && !(data['tags'].is_a?(Array) && data['tags'].all? { |t| t.is_a?(String) && !t.strip.empty? })
  if data['source']
    begin
      uri = URI.parse(data['source'])
      raise 'invalid source' unless %w[http https].include?(uri.scheme) && uri.host
    rescue StandardError
      errors << "#{path}: source must be an http(s) URL"
    end
  end
  if data['cover']
    cover = data['cover']
    if !cover.is_a?(String) || !cover.start_with?('/assets/images/') || cover.include?('..') || !File.file?(File.join(root, cover.sub(%r{\A/}, '')))
      errors << "#{path}: cover must point to an existing file under /assets/images/"
    end
  end
end
abort errors.join("\n") unless errors.empty?
puts "Validated #{ids.size} items and #{drawers.size} categories."

