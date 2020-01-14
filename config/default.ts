module.exports={
  name:'TableJobs',
  cols:{
    submitted_at:{
      type:'int',
      notnull:true
    },
    timeout:{
      type:'int',
      notnull:true,
      check:'timeout > 0'
    },
    project:{
      type:'text',
      notnull:true
    },
    engine:{
      type:'text',
      check:`engine LIKE 'xelatex' OR engine LIKE 'pdflatex'`
    },
    main:{
      type:'text',
      notnull:true
    },
    status:{
      type:'int',// -1: failed; 0: job done; 1: calculating; 2: received
      notnull:true,
      check:'status < 3'
    },
    started_at:{
      type:'int'
    },
    finished_at:{
      type:'int'
    }
  }
}
