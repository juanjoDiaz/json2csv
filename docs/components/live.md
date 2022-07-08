<section id="live-parser">
  <div class="columns">
    <div class="column is-full">
      <p>Remember that the json should be valid.</p>
      <ul>
        <li>Fields should be quoted. I.e., { "a":  1 } is valid, but { a: 1 } is not.</li>
        <li>undefined is not supported</li>
        <li>...</li>
    </div>
  </div>
  <div class="columns">
    <div class="column is-half">
      <div class="field">
        <div class="control">
          <textarea id="json-textarea" class="textarea" placeholder="Input here your JSON" rows="10" v-model="inputJSON"></textarea>
        </div>
      </div>
      <div class="buttons is-centered">
        <button id="format-json" class="button" @click="formatJSON">Format JSON</button>
        <button id="convert-json2csv" class="button is-primary" @click="parseJSON">Convert JSON to CSV</button>
      </div>
    </div>
    <div class="column is-half">
      <div class="field">
        <div class="control">
          <textarea id="csv-textarea" class="textarea" placeholder="Resulting CSV" rows="10" readonly :value="outputCSV"></textarea>
        </div>
      </div>
    </div>
  </div>
  <nav class="panel">
    <p class="panel-heading is-flex is-flex-direction-row is-clickable" @click="showOptions = !showOptions">
      <span class="is-flex-grow-1" aria-label="options">Options</span>
      <span class="icon is-align-self-flex-end">
        <i class="fas" :class="{ 'fa-angle-down': !showOptions, 'fa-angle-up': showOptions }" aria-hidden="true"></i>
      </span>
    </p>
    <p class="panel-tabs" v-if="showOptions">
      <a :class="{ 'is-active': showOptionsForm }" @click="showOptionsForm = true">Form</a>
      <a :class="{ 'is-active': !showOptionsForm }" @click="showOptionsForm = false">JSON</a>
    </p>
    <div class="panel-block" v-if="showOptions && showOptionsForm">
      <div class="column is-full">
        <h4>Input parsing options</h4>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">ND-json</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input id="nd-json" type="checkbox" name="nd-json" class="switch is-rounded is-info" v-model="inputOptions.ndjson">   
                <label for="nd-json">Treat the input as NewLine-Delimited JSON.</label>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Fields</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="List of fields to process. Defaults to field auto-detection."  v-model="inputOptions.fields">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-block" v-if="showOptions && showOptionsForm">
      <div class="column is-full">
        <h4>Transform options</h4>
        <h5>Unwind</h5>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Paths</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="Creates multiple rows from a single JSON document similar to MongoDB unwind." v-model="transformsOptions.unwind.paths">
              </div>
            </div>
          </div>
        </div>
        <div class=" field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Blank Out</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input id="unwindBlankOut" type="checkbox" name="unwindBlankOut" class="switch is-rounded is-info" v-model="transformsOptions.unwind.blankOut">   
                <label for="unwindBlankOut"></label>
              </div>
            </div>
          </div>
        </div>
        <h5>Flatten</h5>
        <div class=" field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Objects</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input id="flatten-objects" type="checkbox" name="flatten-objects" class="switch is-rounded is-info" v-model="transformsOptions.flatten.objects">   
                <label for="flatten-objects"></label>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Arrays</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input id="flatten-arrays" type="checkbox" name="flatten-arrays" class="switch is-rounded is-info" v-model="transformsOptions.flatten.arrays">   
                <label for="flatten-arrays"></label>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Key separator</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="Flattened keys separator.  (default: '.')" v-model="transformsOptions.flatten.separator">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-block" v-if="showOptions && showOptionsForm">
      <div class="column is-full">
        <h4>Formatter options</h4>
        <p>
          formatters are not yet supported in the live converter.<br/>
        </p>
      </div>
    </div>
    <div class="panel-block" v-if="showOptions && showOptionsForm">
      <div class="column is-full">
        <h4>CSV customization options</h4>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Default Value</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="Default value to use for missing fields." v-model="csvOptions.defaultValue">
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Delimiter</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="Character(s) to use as delimiter. (default: ',')" v-model="csvOptions.delimiter">
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">End-of-Line (EoL)</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="Character(s) to use as End-of-Line for separating rows. (default: '\n')" v-model="csvOptions.eol">
              </div>
            </div>
          </div>
        </div>
          <div class=" field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Include headers</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input id="header" type="checkbox" name="header" class="switch is-rounded is-info" v-model="includeHeader">   
                  <label for="header"></label>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Include Empty Rows</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input id="include-empty-rows" type="checkbox" name="include-empty-rows" class="switch is-rounded is-info" v-model="csvOptions.includeEmptyRows">   
                  <label for="include-empty-rows"></label>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Include BOM</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input id="with-bom" type="checkbox" name="with-bom" class="switch is-rounded is-info" v-model="csvOptions.withBOM">   
                  <label for="with-bom"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-block" v-if="showOptions && !showOptionsForm">
      <div class="column is-full">
        <div class="field">
          <div class="control">
            <textarea id="config-textarea" class="textarea" placeholder="Configuration" rows="10" :value="configText" readonly></textarea>
          </div>
        </div>
      </div>
    </div>
  </nav>
</section>